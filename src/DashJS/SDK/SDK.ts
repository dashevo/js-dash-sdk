// import {Wallet} from "@dashevo/wallet-lib";
import {Wallet} from "../../../../wallet-lib/src";
import {Mnemonic, Network} from "@dashevo/wallet-lib/src/types";
import {Platform} from '../Platform';
// @ts-ignore
import DAPIClient from "@dashevo/dapi-client"
// @ts-ignore

const defaultSeeds =  [
    '18.237.69.61',
    '18.236.234.255',
].map(ip => ({ service: `${ip}:3000` }));

export class SDK {
    private network: string;
    public wallet: Wallet;
    public platform: Platform;
    public client: DAPIClient;

    constructor(opts: {
        schema?: object;
        network: Network;
        mnemonic?: Mnemonic
    }) {
        this.network = opts.network;

        this.client = new DAPIClient(Object.assign({seeds:defaultSeeds,
            timeout: 20000,
            retries: 15},opts));

        this.wallet = new Wallet({...opts, offlineMode: !opts.mnemonic});

        this.platform = new Platform(Object.assign({},{client:this.client,schema:opts.schema}))
    }
}
