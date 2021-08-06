/**
 *
 * @param contactName
 * @param accountLabel
 */
export default async function sendContactRequest(this: any, contactName, accountLabel = 'Default account'){
    // @ts-ignore
    const identities = this.storage.getIndexedIdentityIds(this.walletId);
    const senderDashUniqueIdentityId = identities[0];
    const senderIdentity = await this.platform.identities.get(senderDashUniqueIdentityId);

    const senderHdPrivateKey = this.identities.getIdentityHDKeyByIndex(0, 0);

    const senderPrivateKey = senderHdPrivateKey.privateKey;
    const senderPrivateKeyBuffer = senderPrivateKey.toBuffer();
    const retrieveContactName = await this.platform.names.resolve(`${contactName}.dash`);
    if(!retrieveContactName) throw new Error(`No such name found for ${contactName}.dash`);

    const contactDashUniqueIdentityId = retrieveContactName.ownerId.toString();
    const receiverIdentity = await this.platform.identities.get(retrieveContactName.ownerId);

    const receiverPublicKey = receiverIdentity.toJSON().publicKeys[0].data;
    const receiverPublicKeyBuffer = Buffer.from(receiverPublicKey, 'base64');

    const extendedPrivateKey = this.keyChain.getDIP15ExtendedKey('0x'+ senderDashUniqueIdentityId, '0x'+contactDashUniqueIdentityId);
    const extendedPublicKey = extendedPrivateKey.hdPublicKey;
    const extendedPublicKeyBuffers = Buffer.concat([extendedPublicKey._buffers.parentFingerPrint, extendedPublicKey._buffers.chainCode, extendedPublicKey._buffers.publicKey]);

    const sharedSecret = this.keyChain.encryptSharedKey(senderPrivateKeyBuffer, receiverPublicKeyBuffer);
    const accountReference = this.createAccountReference(senderPrivateKeyBuffer, extendedPublicKeyBuffers);
    const encryptedPublicKey = this.keyChain.encryptPublicKey(extendedPublicKeyBuffers, sharedSecret);
    const encryptedPublicKeyBuffer = Buffer.from(encryptedPublicKey, 'hex');
    const encryptedAccountLabelBuffer = Buffer.from(this.encryptAccountLabel(sharedSecret, accountLabel), 'base64')

    const contactRequest = {
        toUserId: receiverIdentity.getId(),
        senderKeyIndex: 0,
        accountReference,
        recipientKeyIndex: 0,
        encryptedPublicKey: encryptedPublicKeyBuffer ,
        encryptedAccountLabel: encryptedAccountLabelBuffer ,
    };

    const contactRequestDocument = await this.platform.documents.create(
        'dashpay.contactRequest',
        senderIdentity,
        contactRequest,
    );

    console.log('contactRequestDocument ', contactRequestDocument.toJSON());

    const documentBatch = {
        create: [contactRequest], // Document(s) to create
        replace: [], // Document(s) to update
        delete: [], // Document(s) to delete
    };

    console.log(documentBatch);
    return;
    // // Sign and submit the document(s)
    // //@ts-ignore
    // return this.platform.documents.broadcast(documentBatch, senderDashUniqueIdentityId);
}
