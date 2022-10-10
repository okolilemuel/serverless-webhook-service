/* eslint-disable no-template-curly-in-string */
import type { AWS } from '@serverless/typescript';
import { default as resources } from './resources';
import * as functions from './src/functions';

const serverlessConfiguration: AWS = {
  service: 'serverless-webhook-service',
  frameworkVersion: '3',
  useDotenv: true,
  package: {
    individually: true,
  },
  custom: {
    seed: {
      incremental: {
        enabled: true,
      },
    },
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
      packager: 'yarn',
    },
    stage: '${opt:stage, self:provider.stage}',
    region: '${opt:region, self:provider.region}',
    stages: ['staging', 'production'],
    prune: {
      automatic: true,
      number: 3,
    },
    alerts: {
      dashboards: true,
      definitions: {
        '5XXErrors': {
          name: '5XXErrors',
          namespace: 'AWS/ApiGateway',
          metric: '5XXError',
          omitDefaultDimension: true,
          dimensions: [
            {
              Name: 'ApiName',
              Value: '${self:service}-${self:custom.stage}',
            },
            {
              Name: 'Stage',
              Value: '${self:custom.stage}',
            },
          ],
          threshold: 5,
          statistic: 'Sum',
          period: 60,
          evaluationPeriods: 1,
          datapointsToAlarm: 1,
          comparisonOperator: 'GreaterThanOrEqualToThreshold',
        },
      },
      alarms: ['functionThrottles', 'functionErrors', '5XXErrors'],
    },
    'export-env': {
      overwrite: true,
      enableOffline: true,
    },
    SQS_WEBHOOK_QUEUE_NAME:
      '${self:service}' + '-' + '${self:custom.stage}' + '-' + 'webhook-queue',
    SQS_WEBHOOK_QUEUE_URL: { Ref: 'WebhookQueue' },
    SQS_WEBHOOK_QUEUE_ARN: {
      'Fn::GetAtt': ['WebhookQueue', 'Arn'],
    },
    resourcePrefix: '${self:service}-${self:provider.stage}',
  },
  plugins: [
    'serverless-export-env',
    'serverless-webpack',
    'serverless-offline',
    'serverless-seed',
    'serverless-stage-manager',
    'serverless-prune-plugin',
    'serverless-plugin-aws-alerts',
  ],
  provider: {
    name: 'aws',
    stage: 'staging',
    region: 'eu-west-1',
    runtime: 'nodejs16.x',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['codedeploy:*'],
        Resource: '*',
      },
      {
        Effect: 'Allow',
        Action: [
          'sqs:ListQueues',
          'sqs:SendMessage',
          'sqs:DeleteMessage',
          'sqs:ReceiveMessage',
        ],
        Resource: '*',
      },
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
      metrics: false, // activate to see CacheHits and Misses
    },
    logs: {
      // activate to see API Gateway logs
      restApi: {
        accessLogging: false,
        executionLogging: false,
        level: 'INFO',
        fullExecutionData: false,
      },
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      STAGE: '${self:custom.stage}',
      SQS_WEBHOOK_QUEUE_URL: '${self:custom.SQS_WEBHOOK_QUEUE_URL}',
      // SERVICE_ENDPOINT: '${cf:${self:custom.resourcePrefix}.ServiceEndpoint}',
    },
    lambdaHashingVersion: '20201221',
  },
  functions: { ...functions },
  resources,
};

module.exports = serverlessConfiguration;
