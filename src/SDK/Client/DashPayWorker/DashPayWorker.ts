import { plugins } from "@dashevo/wallet-lib"

export class DashPayWorker extends plugins.Worker {
    constructor() {
        super({
            name: 'DashPaySyncWorker',
            executeOnStart: true,
            firstExecutionRequired: true,
            awaitOnInjection: true,
            workerIntervalTime: 60 * 1000,
            dependencies: [
                'storage',
                'keyChain',
                'walletId',
                'identities',
                'getUnusedIdentityIndex'
            ],
            injectionOrder:{
                after: ['IdentitySyncWorker']
            }
        });
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
        // TODO
    }

    async onStop(){
    }
}
