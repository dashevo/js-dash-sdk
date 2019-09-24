// import {Wallet} from "@dashevo/wallet-lib";
import {Wallet} from "../../../../wallet-lib/src";
import {Platform} from '../Platform';
// @ts-ignore
import DAPIClient from "@dashevo/dapi-client"
// @ts-ignore

const defaultSeeds =  [
    '18.237.69.61',
    '18.236.234.255',
].map(ip => ({ service: `${ip}:3000` }));

export class SDK {
    private network: string | string;
    public wallet: Wallet;
    public platform: Platform | undefined;
    public client: DAPIClient;

    constructor(opts: {
        schema?: object;
        network: string;
        mnemonic?: string
    }) {
        this.network = opts.network;

        this.client = new DAPIClient(Object.assign({seeds:defaultSeeds,
            timeout: 20000,
            retries: 15},opts));

        this.wallet = new Wallet({...opts, offlineMode: !opts.mnemonic});

        if(opts.schema){
            this.platform = new Platform(Object.assign({},{client:this.client,schema:opts.schema}))
        }
    }
}
