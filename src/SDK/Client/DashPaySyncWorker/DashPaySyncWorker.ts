import { plugins } from "@dashevo/wallet-lib"
import {sendContactRequest} from "../DashPayPlugin/methods/sendContactRequest";
import {DashPayPlugin} from "../DashPayPlugin/DashPayPlugin";

import { fetchContactRequests } from "./methods/fetchContactRequests";

export class DashPaySyncWorker extends plugins.Worker {
    fetchContactRequests: any;
    private fromTimestamp: number;

    constructor() {
        super({
            name: 'DashPaySyncWorker',
            executeOnStart: true,
            firstExecutionRequired: true,
            awaitOnInjection: true,
            workerIntervalTime: 60 * 1000,
            dependencies: [
                'storage',
                'getWorker',
                'getPlugin',
                'keyChain',
                'walletId',
                'identities',
                'getUnusedIdentityIndex'
            ],
            injectionOrder:{
                after: [
                    'IdentitySyncWorker',
                    'DashPayPlugin'
                ]
            }
        });
        this.fromTimestamp = 0;
    }
    async onStart(){
        // Force identities sync before return unused index
        // await this.getWorker('IdentitySyncWorker').execWorker();

        // @ts-ignore
        // const identities = this.identities.getIdentityIds();
        // @ts-ignore
        // const identityIds = this.storage.getIndexedIdentityIds(this.walletId);
        // @ts-ignore
        // const unusedIdentityIndex = await this.getUnusedIdentityIndex();
    }

    async execute(){
        // await this.fetchContactRequests(this.fromTimestamp);
        // set 10 minute before last query
        // see: https://github.com/dashpay/dips/blob/master/dip-0015.md#fetching-contact-requests
        // this.fromTimestamp = +new Date() - 10*60*1000;
    }

    async onStop(){
    }
}
DashPaySyncWorker.prototype.fetchContactRequests = fetchContactRequests;
