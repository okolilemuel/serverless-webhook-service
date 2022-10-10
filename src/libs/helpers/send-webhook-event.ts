import { SendMessageRequest, SendMessageResult } from 'aws-sdk/clients/sqs';
import { z } from 'zod';
import * as sqs from './sqs-helper';

const { SQS_WEBHOOK_SERVICE_QUEUE_URL } = process.env;
const WebhookPayloadSchema = z.object({
  event: z.string(),
  message: z.string(),
  data: z.record(z.number().or(z.string()).or(z.undefined())),
  apiVersion: z.string().optional(),
  checksum: z.string(),
});
const WebhookEventSchema = z.object({
  webhookUrl: z.string(),
  payload: WebhookPayloadSchema,
  userPk: z.string(),
});

export type WebhookEvent = z.infer<typeof WebhookEventSchema>;
export type WebhookPayload = z.infer<typeof WebhookPayloadSchema>;

const sendWebhookEvent = async (
  webhookUrl: string,
  payload: WebhookPayload,
): Promise<SendMessageResult | void> => {
  const params: SendMessageRequest = {
    MessageBody: JSON.stringify({ webhookUrl, payload }),
    QueueUrl: SQS_WEBHOOK_SERVICE_QUEUE_URL || '',
  };
  return await sqs.sendMessage(params);
};

const sendFullWebhookEvent = async (
  event: WebhookEvent,
): Promise<SendMessageResult | void> => {
  const params: SendMessageRequest = {
    MessageBody: JSON.stringify(event),
    QueueUrl: SQS_WEBHOOK_SERVICE_QUEUE_URL || '',
  };
  return await sqs.sendMessage(params);
};

export type webhookEvent = {
  webhookUrl: string;
  payload: Record<string, unknown>;
};
export {
  sendWebhookEvent,
  sendFullWebhookEvent,
  WebhookPayloadSchema,
  WebhookEventSchema,
};
