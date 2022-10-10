import { z } from 'zod';

const SendWebhookEventRequestSchema = z
  .object({
    url: z.string().url(),
    retries: z.number().int().negative().min(1).max(72).default(72).optional(),
    timeout: z
      .number()
      .int()
      .negative()
      .min(3000)
      .max(15000)
      .default(15000)
      .optional(),
    payload: z.object({}),
  })
  .strict();

const SendWebhookEventResponseSchema = z
  .object({
    event_id: z.string(),
    created_at: z.string(),
  })
  .strict();

type SendWebhookEventRequest = z.infer<typeof SendWebhookEventRequestSchema>;
type SendWebhookEventResponse = z.infer<typeof SendWebhookEventResponseSchema>;

export {
  SendWebhookEventRequest,
  SendWebhookEventResponse,
  SendWebhookEventRequestSchema,
  SendWebhookEventResponseSchema,
};
