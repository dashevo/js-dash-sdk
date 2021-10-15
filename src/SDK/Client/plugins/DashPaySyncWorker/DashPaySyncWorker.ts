import { plugins } from "@dashevo/wallet-lib"

export class DashPaySyncWorker extends plugins.Worker {
    private fromTimestamp: number;
    private platform?: any;
    private walletId: string | undefined;
    private identities: any;
    private getPlugin: any;
    private storage: any;

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
                'getUnusedIdentityIndex',
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
            const dashPay = await this.getPlugin('DashPay');
            const identities = this.storage.getIndexedIdentityIds(this.walletId);

            // We require an identity to fetch contacts
            if(identities.length) {
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
    }

    async onStop(){
    }
}
