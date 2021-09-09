import CryptoJS from "crypto-js"

/**
 * @param publicKeyBuffer - public key in buffer format
 * @param encryptedSharedSecret - shared secret in hexadecimal format
 * @returns {null}
 */
export function encryptPublicKey(publicKeyBuffer, encryptedSharedSecret) {
    const parsedPublicKey = CryptoJS.enc.Hex.parse(publicKeyBuffer.toString('hex'));
    const cipher = CryptoJS.AES.encrypt(parsedPublicKey, encryptedSharedSecret, {
        iv: CryptoJS.lib.WordArray.random(16),
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC,
    });
    const cipherText = cipher.ciphertext.toString(CryptoJS.enc.Hex);
    if (!Buffer.from(cipherText, 'hex').length) {
        throw new Error('Invalid cipher size');
    }
    const ivText = cipher.iv.toString(CryptoJS.enc.Hex);

    return Buffer.concat([
        Buffer.from(ivText, 'hex'),
        Buffer.from(cipherText, 'hex'),
    ]).toString('hex');
};
