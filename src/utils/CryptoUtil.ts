import CryptoJS from "crypto-js";

const secretKey = process.env.REACT_APP_AES256_SECRET_KEY;
const ivKey = process.env.REACT_APP_AES256_IV_KEY;

export const encryptAES = (text: string): string => {
  if (secretKey === undefined || ivKey === undefined) {
    throw new Error("키가 없습니다.");
  }

  const decSecretKey = CryptoJS.enc.Base64.parse(secretKey);
  const decIv = CryptoJS.enc.Base64.parse(ivKey);

  const encrypted = CryptoJS.AES.encrypt(text, decSecretKey, {
    iv: decIv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString();
};

