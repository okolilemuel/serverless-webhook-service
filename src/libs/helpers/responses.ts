/* eslint-disable no-nested-ternary */
import { ServiceResponse } from '../types';

const getErrorBodyAndHeaders = (
  defaultError: string,
  message?: string | Record<string, unknown> | unknown | null,
) => {
  return {
    body: JSON.stringify({
      message: message && typeof message === 'string' ? message : defaultError,
      validationError:
        message && typeof message !== 'string' ? message : undefined,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Live-Mode': true,
      'Access-Control-Allow-live-mode': true,
    },
  };
};

const getSuccessBodyAndHeaders = (
  defaultSuccess: string,
  message?: string | Record<string, unknown> | null,
) => {
  return {
    body: JSON.stringify({
      message:
        message && typeof message === 'string' ? message : defaultSuccess,
      data:
        message && typeof message !== 'string' && message.data
          ? message.data
          : message && typeof message !== 'string'
          ? message
          : undefined,
      next:
        message && typeof message !== 'string' && message.next
          ? message.next
          : undefined,
    }),
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
  };
};

const validationError = (
  message?: string | Record<string, unknown> | unknown | null,
): ServiceResponse => ({
  statusCode: 400,
  ...getErrorBodyAndHeaders('Validation Error', message),
});

const internalError = (
  message?: string | Record<string, unknown> | unknown | null,
): ServiceResponse => ({
  statusCode: 500,
  ...getErrorBodyAndHeaders('Internal Error', message),
});

const unauthorizedError = (
  message?: string | Record<string, unknown> | unknown | null,
): ServiceResponse => ({
  statusCode: 401,
  ...getErrorBodyAndHeaders('Unauthorized', message),
});

const success = (
  message?: string | Record<string, unknown> | null,
): ServiceResponse => ({
  statusCode: 200,
  ...getSuccessBodyAndHeaders('Ok', message),
});

const created = (
  message?: string | Record<string, unknown> | null,
): ServiceResponse => ({
  statusCode: 201,
  ...getSuccessBodyAndHeaders('Ok', message),
});

export { created, success, internalError, validationError, unauthorizedError };
