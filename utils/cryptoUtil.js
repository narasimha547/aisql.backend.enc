const CryptoJS = require("crypto-js");
require("dotenv").config(); // Load environment variables

const SECRET_KEY = process.env.TOKEN_CRYPTO_SECRET; // Secret key for encryption

// Encrypt function
const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), SECRET_KEY).toString();
};

// Decrypt function
const decryptData = (ciphertext) => {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

module.exports = { encryptData, decryptData };
