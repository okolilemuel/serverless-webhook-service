/* eslint-disable no-case-declarations */
import request from 'superagent';
import { SQSEvent } from 'aws-lambda';
import {
  deleteMessage,
  checkIfSQSMessageValidityPeriodHasExpired,
} from '@/libs/helpers/sqs-helper';

const webhookTrigger = async (event: SQSEvent) => {
  const { Records } = event;

  const results = await Promise.allSettled(
    Records.map(async (record) => {
      const { body, receiptHandle, attributes } = record;
      const parsedBody = JSON.parse(body);
      const { url, payload } = parsedBody;

      const sentTimestamp = attributes.SentTimestamp;

      const SQSMessageValidityPeriodHasExpired =
        await checkIfSQSMessageValidityPeriodHasExpired(sentTimestamp);

      if (SQSMessageValidityPeriodHasExpired) {
        await deleteMessage({
          ReceiptHandle: receiptHandle,
          QueueUrl: process.env.SQS_WEBHOOK_QUEUE_URL || '',
        });
        return;
      }

      console.log(`Attempting to send to ${url}`);

      try {
        const response = await request
          .post(url)
          .timeout({
            response: payload.timeout || 15000,
            deadline: payload.timeout || 15000,
          })
          .set('Content-Type', 'application/json')
          .send(payload);

        const { status } = response;
        if (status === 200 || status === 201 || status === 204) {
          return;
        }
        throw new Error(
          `webhook event was not sent, and will be retried after visibility timeout`,
        );
      } catch (error) {
        console.error(error);
        throw error;
      }
    }),
  );
  return results;
};

export const main = webhookTrigger;
