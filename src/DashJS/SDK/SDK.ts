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
    public platform: Platform;
    private client: any;

    constructor(opts: {
        schema: any;
        network: string; }) {
        this.network = opts.network;
        // @ts-ignore
        // @ts-ignore


        this.client = new DAPIClient(Object.assign({seeds:defaultSeeds,
            timeout: 20000,
            retries: 15},opts));
        // @ts-ignore
        this.wallet = new Wallet(opts);
        this.platform = new Platform(Object.assign({},{client:this.client,schema:opts.schema}))
    }


}
