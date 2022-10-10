import { sha512 } from 'js-sha512';

const generateLedgerAccountHash = (
  account: Record<string, unknown>,
): string => {
  return sha512.hmac(account.account_id as string, JSON.stringify(account));
};

export { generateLedgerAccountHash };
