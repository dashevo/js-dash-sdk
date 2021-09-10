/**
 *
 */
export async function fetchContactRequests(this: any, fromTimestamp = 0){
    // @ts-ignore
    const identities = this.storage.getIndexedIdentityIds(this.walletId);
    if(!identities.length){
        throw new Error('Require an identity to send a contact request');
    }
    const receiverDashUniqueIdentityId = identities[0];
    console.log(receiverDashUniqueIdentityId);
    const receiverIdentity = await this.platform.identities.get(receiverDashUniqueIdentityId);
    console.log(receiverIdentity.getId())
    const contactRequests = await this.platform.documents.get('dashpay.contactRequest', {
        where: [
            ['$ownerId', '==', receiverIdentity.getId()],
            ['$createdAt', '>', fromTimestamp]
        ],
    });
    console.log(+new Date());

    console.log(contactRequests);
    // return this.platform.documents.broadcast(documentBatch, senderDashUniqueIdentityId);
}
