import { plugins } from "@dashevo/wallet-lib"

import { fetchContactRequests } from "./methods/fetchContactRequests";

export class DashPaySyncWorker extends plugins.Worker {
    fetchContactRequests: any;
    private fromTimestamp: number;
    private platform?: any;

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
                    'DashPay'
                ]
            }
        });
        this.fromTimestamp = 0;
    }

    async execute(){
        if(this.platform && this.platform.identities){
            // @ts-ignore
            const dashPay = await this.getPlugin('DashPay');

            const contacts = await dashPay.fetchEstablishedContacts(this.fromTimestamp);
            // set 10 minute before last query
            // see: https://github.com/dashpay/dips/blob/master/dip-0015.md#fetching-contact-requests
            this.fromTimestamp = +new Date() - 10*60*1000;
            contacts.forEach((contact)=>{
                console.log(`DashPaySyncWorker - Fetched contact ${contact.username}`);
                console.log(contact);
            })
        }
    }

    async onStop(){
    }
}
DashPaySyncWorker.prototype.fetchContactRequests = fetchContactRequests;
