import {Contact} from "../Contact";

/**
 * Fetch establish contact from a specific timestamp
 * @param fromTimestamp {Number} - optional timestamp
 * @return {Contact[]} establishedContact - All established contacts
 */
export async function fetchEstablishedContacts(this: any, fromTimestamp = 0) {
    const establishedContacts: Contact[] = [];
    const receivedContactRequests = await this.fetchReceivedContactRequests(fromTimestamp);
    const receivedContactRequestsSenderIds = receivedContactRequests.map((sentContactRequest) => sentContactRequest.ownerId.toString());

    const sentContactRequests = await this.fetchSentContactRequests(fromTimestamp);
    const sentContactRequestsReceiverIds = sentContactRequests.map((sentContactRequest) => sentContactRequest.data.toUserId.toString());

    const usernameFetchingPromises: Promise<any>[] = [];

    sentContactRequestsReceiverIds.forEach((sentContactRequestsReceiverId, sentIdsArrayIndex) => {
        const receivedIdsArrayIndex = receivedContactRequestsSenderIds.indexOf(sentContactRequestsReceiverId);
        if (receivedIdsArrayIndex !== -1) {
            const contact = new Contact(sentContactRequestsReceiverId, sentContactRequests[sentIdsArrayIndex], receivedContactRequests[receivedIdsArrayIndex]);
            const usernameFetchingPromise = this.platform.names.resolveByRecord('dashUniqueIdentityId', contact.identityId)
                .then((record) => {
                    if (record && record[0]) {
                        console.log(record[0].data);
                        contact.setUsername(record[0].data.label);
                    }
                });

            usernameFetchingPromises.push(usernameFetchingPromise);
            establishedContacts.push(contact);
        }
    });
    await Promise.all(usernameFetchingPromises);
    if(establishedContacts){
        console.log(establishedContacts[0].receivedRequest.data)
        console.log(establishedContacts[0].receivedRequest.data.encryptedPublicKey.toString('hex'))
        const receiverPublicKey = establishedContacts[0].receivedRequest.ownerId.toJSON().publicKeys[0].data;
        const receiverPublicKeyBuffer = Buffer.from(receiverPublicKey, 'base64');

        const senderHdPrivateKey = this.identities.getIdentityHDKeyByIndex(0, 0);

        const senderPrivateKey = senderHdPrivateKey.privateKey;
        const senderPrivateKeyBuffer = senderPrivateKey.toBuffer();
        const encryptedSharedSecret = this.encryptSharedKey(senderPrivateKeyBuffer, receiverPublicKeyBuffer);

        console.log(this.decryptPublicKey(establishedContacts[0].receivedRequest.data.encryptedPublicKey, encryptedSharedSecret))
    }

    // TODO: Fetch public information (avatarPath, publicMessage)
    return establishedContacts;
}
