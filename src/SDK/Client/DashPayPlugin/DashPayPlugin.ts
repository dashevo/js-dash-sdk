import { plugins } from "@dashevo/wallet-lib"

import { createAccountReference } from "./methods/createAccountReference";
import { encryptAccountLabel } from "./methods/encryptAccountLabel";
import { decryptAccountLabel }from "./methods/decryptAccountLabel";
import { sendContactRequest } from "./methods/sendContactRequest";
console.log(plugins.StandardPlugin);

export class DashPayPlugin extends plugins.StandardPlugin {
    createAccountReference: any;
    decryptAccountLabel: any;
    encryptAccountLabel: any;
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
DashPayPlugin.prototype.sendContactRequest = sendContactRequest;
