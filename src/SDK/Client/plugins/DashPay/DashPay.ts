import { plugins } from "@dashevo/wallet-lib"

import { acceptContactRequest } from "./methods/acceptContactRequest";
import { createAccountReference } from "./methods/createAccountReference";
import { decryptAccountLabel }from "./methods/decryptAccountLabel";
import { encryptAccountLabel } from "./methods/encryptAccountLabel";
import { encryptPublicKey } from "./methods/encryptPublicKey";
import { encryptSharedKey } from "./methods/encryptSharedKey";
import { fetchEstablishedContacts } from "./methods/fetchEstablishedContacts";
import { fetchReceivedContactRequests } from "./methods/fetchReceivedContactRequests";
import { fetchSentContactRequests } from "./methods/fetchSentContactRequests";
import { sendContactRequest } from "./methods/sendContactRequest";

export class DashPay extends plugins.StandardPlugin {
    acceptContactRequest: any;
    createAccountReference: any;
    decryptAccountLabel: any;
    encryptAccountLabel: any;
    encryptPublicKey: any;
    encryptSharedKey: any;
    fetchEstablishedContacts: any;
    fetchReceivedContactRequests: any;
    fetchSentContactRequests: any;
    sendContactRequest: any;
    constructor() {
        super({
            name: 'DashPay',
            executeOnStart: true,
            firstExecutionRequired: true,
            awaitOnInjection: true,
            workerIntervalTime: 60 * 1000,
            dependencies: [
                'storage',
                'keyChain',
                'decrypt',
                'encrypt',
                'walletId',
                'identities',
                'getUnusedIdentityIndex'
            ],
            injectionOrder:{
                after: ['IdentitySyncWorker']
            }
        });
    }
}
DashPay.prototype.acceptContactRequest = acceptContactRequest;
DashPay.prototype.createAccountReference = createAccountReference;
DashPay.prototype.decryptAccountLabel = decryptAccountLabel;
DashPay.prototype.encryptAccountLabel = encryptAccountLabel;
DashPay.prototype.encryptPublicKey = encryptPublicKey;
DashPay.prototype.encryptSharedKey = encryptSharedKey;
DashPay.prototype.fetchEstablishedContacts = fetchEstablishedContacts;
DashPay.prototype.fetchReceivedContactRequests = fetchReceivedContactRequests;
DashPay.prototype.fetchSentContactRequests = fetchSentContactRequests;
DashPay.prototype.sendContactRequest = sendContactRequest;
