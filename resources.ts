import config from './config';

export default {
  Resources: {
    WebhookQueue: {
      Type: 'AWS::SQS::Queue',
      Properties: {
        QueueName: '${self:custom.SQS_WEBHOOK_QUEUE_NAME}',
        VisibilityTimeout: config.queueVisibilityTimeout,
      },
    },
  },
  Outputs: {
    ServiceEndpoint: {
      Export: {
        Name: '${self:service}-${self:custom.stage}-API-Endpoint',
      },
    },
  },
};
