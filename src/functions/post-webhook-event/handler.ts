import 'source-map-support/register';
import { middyfy } from '@/libs/lambda';
import { APIGatewayProxyEvent, Handler } from 'aws-lambda';
import {
  created,
  internalError,
  validationError,
} from '@/libs/helpers/responses';
import { zodErrorHelper } from '@/libs/helpers/zod-error';
import { SendWebhookEventRequestSchema } from '@/schemas/webhook.schema';
import { ZodError } from 'zod';
import { SendMessageRequest } from 'aws-sdk/clients/sqs';
import { sendMessage } from '@/libs/helpers/sqs-helper';

const postCreateUser: Handler = async (event: APIGatewayProxyEvent) => {
  let requestBody;
  try {
    requestBody = SendWebhookEventRequestSchema.parse(event.body);
  } catch (error) {
    console.error(error);
    return validationError(zodErrorHelper((error as ZodError).issues));
  }

  try {
    const params: SendMessageRequest = {
      MessageBody: JSON.stringify(requestBody),
      QueueUrl: process.env.SQS_WEBHOOK_QUEUE_URL || '',
    };
    const result = await sendMessage(params);
    return created({
      event_id: (result as any).MessageId,
      created_at: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);
    return internalError();
  }
};

export const main = middyfy(postCreateUser);
