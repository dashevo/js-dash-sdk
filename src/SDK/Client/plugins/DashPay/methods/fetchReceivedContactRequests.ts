/**
 *
 */
export async function fetchReceivedContactRequests(this: any, fromTimestamp = 0){
    // @ts-ignore
    const identities = this.storage.getIndexedIdentityIds(this.walletId);
    if(!identities.length){
        throw new Error('Require an identity to fetch sent contact requests');
    }
    const receiverDashUniqueIdentityId = identities[0];
    const receiverIdentity = await this.platform.identities.get(receiverDashUniqueIdentityId);

    return this.platform.documents.get('dashpay.contactRequest', {
        where: [
            ['toUserId', '==', receiverIdentity.getId()],
            ['$createdAt', '>', fromTimestamp]
        ],
    });
}
