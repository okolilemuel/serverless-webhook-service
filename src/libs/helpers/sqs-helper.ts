import { SQS } from 'aws-sdk';
import { SendMessageRequest, SendMessageResult } from 'aws-sdk/clients/sqs';
import { MAX_QUEUE_RETRIES } from '../types';

const sendMessage = async (
  params: SQS.SendMessageRequest,
): Promise<SendMessageResult | void> => {
  try {
    return await new SQS().sendMessage(params).promise();
  } catch (error) {
    console.error(error);
  }
};

const deleteMessage = async (
  params: SQS.DeleteMessageRequest,
): Promise<void> => {
  try {
    await new SQS().deleteMessage(params).promise();
  } catch (error) {
    console.error(error);
  }
};

const checkIfSQSMessageValidityPeriodHasExpired = async (
  sentTimestamp: string,
): Promise<boolean> => {
  const now = Date.now();
  const diff = now - Number(sentTimestamp);
  console.log(diff, 'diff');
  // here we are checking that the difference between now and when message/event was first queued
  // is greater than 72 (MAX_QUEUE_RETRIES) hrs * 60 mins * 60 seconds
  // diff and sentTimestamp are expressed in milliseconds
  return diff / 1000 > MAX_QUEUE_RETRIES * 60 * 60;
};

const sendMessageToQueue = async (
  messageBody: Record<string, unknown>,
  queueUrl: string,
  delaySeconds = 5,
): Promise<SendMessageResult | void> => {
  const params: SendMessageRequest = {
    MessageBody: JSON.stringify(messageBody),
    QueueUrl: queueUrl,
    DelaySeconds: delaySeconds,
  };

  return await sendMessage(params);
};

export {
  sendMessage,
  deleteMessage,
  sendMessageToQueue,
  checkIfSQSMessageValidityPeriodHasExpired,
};
