import CryptoJS from 'crypto-js';

const SECRET_KEY = 'C6uTJdX2-C6uTJdX1-C6uTJdX3';

export function encryptData(data) {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
}

export function decryptData(cipherText) {
  const bytes = CryptoJS.AES.decrypt(cipherText, SECRET_KEY);
  const decrypted = bytes.toString(CryptoJS.enc.Utf8);
  try {
    return JSON.parse(decrypted);
  } catch (e) {
    return null;
  }
}
