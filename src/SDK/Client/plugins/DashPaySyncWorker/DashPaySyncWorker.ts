import { plugins } from "@dashevo/wallet-lib"

export class DashPaySyncWorker extends plugins.Worker {
    private fromTimestamp: number;
    private platform?: any;
    private walletId: any;
    private identities: any;
    private getPlugin: any;
    private storage: any;
    private contacts: any[];

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
            injectionOrder: {
                after: [
                    'IdentitySyncWorker',
                    'DashPay'
                ]
            }
        });
        this.contacts = [];
        this.fromTimestamp = 0;
    }

    async execute() {
        if (this.platform && this.platform.identities) {
            const dashPay = await this.getPlugin('DashPay');
            const identities = this.storage.getIndexedIdentityIds(this.walletId);

            // We require an identity to fetch contacts
            if (identities.length) {
                const contacts = await dashPay.fetchEstablishedContacts(this.fromTimestamp);
                // set 10 minute before last query
                // see: https://github.com/dashpay/dips/blob/master/dip-0015.md#fetching-contact-requests
                this.fromTimestamp = +new Date() - 10 * 60 * 1000;
                const addressesStore = this.storage.store.wallets[this.walletId].addresses;

                contacts
                    .forEach((contact) => {
                        console.log(`DashPaySyncWorker - Fetched contact ${contact.username}`);
                        this.contacts.push(contact);
                        const { receiving } = contact.keys;
                        const receiverRootPath = `${contact.sentRequest.ownerId}/${contact.receivedRequest.ownerId}`
                        const sendingRootPath = `${contact.receivedRequest.ownerId}/${contact.sentRequest.ownerId}`

                        addressesStore.misc[`${receiverRootPath}/0`] = {
                            path: `${sendingRootPath}/0`,
                            index: 0,
                            transactions: [],
                            address: receiving.deriveChild(0).privateKey.toAddress(),
                            balanceSat: 0,
                            unconfirmedBalanceSat: 0,
                            utxos: {},
                            fetchedLast: 0,
                            used: false
                        };
                    })

            }
        }
    }

    async onStop() {
    }
}
