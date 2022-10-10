export const MAX_QUEUE_RETRIES = 72;

export interface ServiceResponse {
  statusCode: number;
  body: string;
  headers: {
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Credentials': boolean;
  };
}

export enum ALGORITHM_NAMES {
  SHA1 = 'sha1',
  SHA256 = 'sha256',
}

export enum ENCODINGS {
  BASE64 = 'base64',
}
