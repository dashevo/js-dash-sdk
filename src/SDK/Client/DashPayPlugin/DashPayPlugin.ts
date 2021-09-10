import { plugins } from "@dashevo/wallet-lib"

import { acceptContactRequest } from "./methods/acceptContactRequest";
import { createAccountReference } from "./methods/createAccountReference";
import { decryptAccountLabel }from "./methods/decryptAccountLabel";
import { encryptAccountLabel } from "./methods/encryptAccountLabel";
import { encryptPublicKey } from "./methods/encryptPublicKey";
import { encryptSharedKey } from "./methods/encryptSharedKey";
import { sendContactRequest } from "./methods/sendContactRequest";

export class DashPayPlugin extends plugins.StandardPlugin {
    acceptContactRequest: any;
    createAccountReference: any;
    decryptAccountLabel: any;
    encryptAccountLabel: any;
    encryptPublicKey: any;
    encryptSharedKey: any;
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
DashPayPlugin.prototype.acceptContactRequest = acceptContactRequest;
DashPayPlugin.prototype.createAccountReference = createAccountReference;
DashPayPlugin.prototype.decryptAccountLabel = decryptAccountLabel;
DashPayPlugin.prototype.encryptAccountLabel = encryptAccountLabel;
DashPayPlugin.prototype.encryptPublicKey = encryptPublicKey;
DashPayPlugin.prototype.encryptSharedKey = encryptSharedKey;
DashPayPlugin.prototype.sendContactRequest = sendContactRequest;
