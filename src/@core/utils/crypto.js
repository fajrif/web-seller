import CryptoJS from 'crypto-js';

const CRYPTO_SECRET_KEY = 'C6uTJdX2-C6uTJdX1-C6uTJdX3';

export function encryptData(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), CRYPTO_SECRET_KEY).toString();
}

export function decryptData(cipherText) {
  const bytes = CryptoJS.AES.decrypt(cipherText, CRYPTO_SECRET_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  try {
    return JSON.parse(decrypted);
  } catch (e) {
    return null;
  }
}
