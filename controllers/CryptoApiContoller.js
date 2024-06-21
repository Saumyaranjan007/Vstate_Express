// utils/encryption.js

import CryptoJS from 'crypto-js';

// Secret key for encryption (should be securely stored and managed)
const secretKey = 'your-32-character-secret';

 const encryptData = (data) => {
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), CryptoJS.enc.Utf8.parse(secretKey), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString();
  return encodeURIComponent(ciphertext); // Encode to make it URL-safe
};

export const decryptData = (ciphertext) => {
  console.log(ciphertext);
  const bytes = CryptoJS.AES.decrypt(decodeURIComponent(ciphertext), CryptoJS.enc.Utf8.parse(secretKey), {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  console.log(bytes);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
  console.log(decryptedData);
  return JSON.parse(decryptedData);
};

const encryption ={
  encryptData,
  decryptData
}

export default encryption;