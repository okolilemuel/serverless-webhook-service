import { BinaryToTextEncoding, createHmac } from 'crypto';

enum OUTPUT_TYPE {
  HEX = 'hex',
  BASE64 = 'base64',
  BASE64URL = 'base64url',
}

const generateHmac = (
  alogorithm: 'sha256' | 'sha512',
  key: string,
  value: string,
  output: OUTPUT_TYPE,
): string => {
  return createHmac(alogorithm, key)
    .update(value)
    .digest(output as BinaryToTextEncoding);
};

export { generateHmac, OUTPUT_TYPE };
