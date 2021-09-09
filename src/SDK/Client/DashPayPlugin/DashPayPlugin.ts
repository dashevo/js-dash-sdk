import { plugins } from "@dashevo/wallet-lib"

import { createAccountReference } from "./methods/createAccountReference";
import { encryptAccountLabel } from "./methods/encryptAccountLabel";
import { decryptAccountLabel }from "./methods/decryptAccountLabel";
import { sendContactRequest } from "./methods/sendContactRequest";
import { encryptPublicKey } from "./methods/encryptPublicKey";
import { encryptSharedKey } from "./methods/encryptSharedKey";

export class DashPayPlugin extends plugins.StandardPlugin {
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
DashPayPlugin.prototype.createAccountReference = createAccountReference;
DashPayPlugin.prototype.decryptAccountLabel = decryptAccountLabel;
DashPayPlugin.prototype.encryptAccountLabel = encryptAccountLabel;
DashPayPlugin.prototype.encryptPublicKey = encryptPublicKey;
DashPayPlugin.prototype.encryptSharedKey = encryptSharedKey;
DashPayPlugin.prototype.sendContactRequest = sendContactRequest;
