/**
 *
 */
export async function fetchSentContactRequests(this: any, fromTimestamp = 0){
    // @ts-ignore
    const identities = this.storage.getIndexedIdentityIds(this.walletId);
    if(!identities.length){
        throw new Error('Require an identity to fetch sent contact requests');
    }
    const senderDashUniqueIdentityId = identities[0];
    const senderIdentity = await this.platform.identities.get(senderDashUniqueIdentityId);

    return this.platform.documents.get('dashpay.contactRequest', {
        where: [
            ['$ownerId', '==', senderIdentity.getId()],
            ['$createdAt', '>', fromTimestamp]
        ],
    });
}
