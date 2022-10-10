export default {
  handler: `${__dirname.split(process.cwd())[1].substring(1)}/handler.main`,
  events: [
    {
      sqs: {
        arn: '${self:custom.SQS_WEBHOOK_QUEUE_ARN}',
        batchSize: 1,
      },
    },
  ],
};
