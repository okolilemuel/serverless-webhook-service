# Serverless Webhook Service

This is a serverless webhook service for sending webhook events/messages to http endpoints.
It is powered by AWS cloud and the serverless framework.

The services works by receiveing a message payload and destination url, and forwarding the message to the provided destination while handling retries and tiemouts.

The retry interval is set to 1 hour by default and the max retry count is set to 72 hours (3 days) by default. The retry count and request timeout can be customised in the post request sent to the service.

## Requirements

1. AWS account
2. Node.js
3. Serverless

## Usage

Clone the repository and run `yarn` command to install dependencies.

Run `yarn deploy:staging` or `yarn deploy:production` command to deploy the service to your `AWS` account

Run `yarn start` command to start the service locally

Run `npx sls info --stage [staging or production]` command to get the service base URL


## API Docs
Run `yarn docs` command to view the API docs.
