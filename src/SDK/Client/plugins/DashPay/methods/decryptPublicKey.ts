import CryptoJS from "crypto-js"

/**
 *  encryptedXpub: ByteArray,
 contactPublicKey: ECKey,
 signingAlgorithm: IdentityPublicKey.TYPES,
 keyIndex: Int,
 keyParameter: KeyParameter?


 * @param publicKeyBuffer
 * @param encryptedSharedSecret
 */
export function decryptPublicKey(encryptedPublicKeyBuffer, encryptedSharedSecret) {
    if(!Buffer.isBuffer(encryptedPublicKeyBuffer)){
        throw new Error("Expected encryptedPublicKey as Buffer");
    }
    const parsedSharedSecret = CryptoJS.enc.Hex.parse(encryptedSharedSecret);

    const encryptedCipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: CryptoJS.enc.Hex
            .parse(encryptedPublicKeyBuffer.slice(16, encryptedPublicKeyBuffer.length)
            .toString('hex')),
    });

    const decryptedPublicKey = CryptoJS.AES.decrypt(
        encryptedCipherParams,
        parsedSharedSecret,
        {
            iv: CryptoJS.enc.Hex.parse(encryptedPublicKeyBuffer
                .slice(0, 16)
                .toString('hex'))
        }
    );

    return decryptedPublicKey
        .toString(CryptoJS.enc.Hex)

};
