import { sha256hmac } from "@dashevo/dashcore-lib/lib/crypto/hash"

/**
 *
 * See https://github.com/dashpay/dips/blob/master/dip-0015.md#the-account-reference-accountreference
 * @param senderPrivateKeyBuffer
 * @param extendedPublicKeyBuffer
 * @param accountIndex
 * @param version
 */
export function createAccountReference(senderPrivateKeyBuffer, extendedPublicKeyBuffer, accountIndex = 0, version = 0){
    const AccountSecretKeyBuffer = sha256hmac(senderPrivateKeyBuffer, extendedPublicKeyBuffer);
    const AccountSecretKey32Buffer = AccountSecretKeyBuffer.slice(0, 4);
    const AccountSecretKey28Buffer = parseInt(AccountSecretKey32Buffer.toString('hex'), 16) >> 4;

    const shortenedAccountBits = accountIndex & 0x0FFFFFFF;
    const versionBits = version << 28;

    return versionBits | (AccountSecretKey28Buffer ^ shortenedAccountBits);
}
