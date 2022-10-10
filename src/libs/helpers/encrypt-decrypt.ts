import Cryptr from 'cryptr';

const cryptr = new Cryptr(process.env.ENCRYPT_DECRYPT_KEY || '');

const encryptData = (data: string): string => {
  return cryptr.encrypt(data);
};

const decryptEncryptedData = (encryptedData: string): string => {
  return cryptr.decrypt(encryptedData);
};

export { encryptData, decryptEncryptedData };
