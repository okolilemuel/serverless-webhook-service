import { ALGORITHM_NAMES } from '../types';
import { generateHmac, OUTPUT_TYPE } from './hmac-helper';

const generateChecksum = (
  body: Record<string, any>,
  integratorId: string,
): string => {
  let extractedString = '';
  for (const datum in body) {
    if (isLiteralObject(body[datum])) {
      extractedString = extractedString.concat(
        Object.values(body[datum]).join(''),
      );
      continue;
    }
    extractedString = extractedString.concat(body[datum]);
  }

  return generateHmac(
    ALGORITHM_NAMES.SHA256,
    integratorId || '',
    extractedString,
    OUTPUT_TYPE.HEX,
  );
};

const isLiteralObject = function (a: any) {
  return !!a && a.constructor === Object;
};

export { generateChecksum };
