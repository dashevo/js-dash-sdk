import {Contact} from "../types/Contact";
import {Profile} from "../types/Profile";
import {HDPublicKey} from "@dashevo/dashcore-lib/typings/HDPublicKey";

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

    const infoFetchingPromises: Promise<any>[] = [];

    sentContactRequestsReceiverIds.forEach((sentContactRequestsReceiverId, sentIdsArrayIndex) => {
        const receivedIdsArrayIndex = receivedContactRequestsSenderIds.indexOf(sentContactRequestsReceiverId);
        if (receivedIdsArrayIndex !== -1) {
            const contact = new Contact(sentContactRequestsReceiverId, sentContactRequests[sentIdsArrayIndex], receivedContactRequests[receivedIdsArrayIndex]);

            const fetchAndPopulateDPNSRecord = () => {
                return this.platform.names
                    .resolveByRecord('dashUniqueIdentityId', contact.identityId)
                    .then((record) => contact.setUsername(record && record[0] && record[0].data.label));
            }

            const fetchAndPopulateIdentity = () => {
                return this.platform.identities
                    .get(contact.identityId)
                    .then((identity) => contact.setIdentity(identity));
            }

            const fetchAndPopulateDashPayProfile = () => {
                return this.fetchProfile(contact.identityId)
                    .then((profile) => contact.setProfile(profile));
            }

            // We need to fetch DPNS record, DashPay public data and identity for each contact
            const infoFetchingPromise = fetchAndPopulateDPNSRecord()
                .then(fetchAndPopulateIdentity)
                .then(fetchAndPopulateDashPayProfile);

            // The private key at snderKeyIndex of the sender and the public key at recipientKeyIndex of the recipient
            console.log(contact);
            const contactPublicKeys = contact.identity.publicKeys;
            console.log({contactPublicKeys});
            // const sendingSharedSecret = contact.receivedRequest.senderKeyIndex + contact.receivedRequest.recipientKeyIndex;
            //The private key at the recipientKeyIndex of the recipient and the public key at senderKeyIndex of the sender
            // const receivingSharedSecret = contact.sentRequest.senderKeyIndex + contact.sentRequest.recipientKeyIndex;
            // For each contact we decrypt the publicKey
            // const encryptedReceivingPublicKeyBuffer = 0;
            // const encryptedPublicKeyBuffer = 0;
            // const decryptedReceivingPublicKey = this.decryptPublicKey(encryptedPublicKeyBuffer, sharedSecret)
            // const decryptedSendingPublicKey = this.decryptPublicKey(encryptedPublicKeyBuffer, sharedSecret)

            // const contactXPublicKeyBuffer = Buffer.from(decryptedPublicKey, 'hex');
            // const contactPublicKey = HDPublicKey.fromObject({
                // parentFingerPrint: contactXPublicKeyBuffer.slice(0,4),
                // chainCode: contactXPublicKeyBuffer.slice(4, 36),
                // publicKey: contactXPublicKeyBuffer.slice(36, 69),
                // network: 'testnet',
                // depth: Buffer.alloc(1),
                // childIndex: Buffer.alloc(4),
            // })

            contact.setAddresses({
                // sending: [contactPublicKey.derive()],
                // receiving: []
                sending: ['yP8A3cbdxRtLRduy5mXDsBnJtMzHWs6ZXr'],
                receiving: ['yP8A3cbdxRtLRduy5mXDsBnJtMzHWs6ZXr']
            });

            infoFetchingPromises.push(infoFetchingPromise);
            establishedContacts.push(contact);


        }
    });
    await Promise.all(infoFetchingPromises);
    return establishedContacts;
}
