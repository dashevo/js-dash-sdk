import { plugins } from "@dashevo/wallet-lib"

import createAccountReference from "./methods/createAccountReference";
import encryptAccountLabel from "./methods/encryptAccountLabel";
import sendContactRequest from "./methods/sendContactRequest";
import decryptAccountLabel from "./methods/decryptAccountLabel";

export class DashPayPlugin extends plugins.StandardPlugin {
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
    createAccountReference = createAccountReference;

    decryptAccountLabel = decryptAccountLabel;

    encryptAccountLabel = encryptAccountLabel;

    sendContactRequest = sendContactRequest;

}
