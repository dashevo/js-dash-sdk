// import {Wallet} from "@dashevo/wallet-lib";
import {Wallet} from "../../../../wallet-lib/src";
import {Mnemonic, Network} from "@dashevo/wallet-lib/src/types";
import {Platform, PlatformOpts} from '../Platform';
// @ts-ignore
import DAPIClient from "@dashevo/dapi-client"

const defaultSeeds = [
    '18.237.69.61',
    '18.236.234.255',
].map(ip => ({service: `${ip}:3000`}));

export interface SDKOpts {
  schema?: object;
  network?: Network;
  mnemonic?: Mnemonic|string
}

export class SDK {
    network: string;
    public wallet: Wallet;
    public platform: Platform;
    public client: DAPIClient;


    constructor(opts?: SDKOpts) {
        this.network = (opts && opts.network) ? opts.network : 'testnet';

        this.client = new DAPIClient(Object.assign({
            seeds: defaultSeeds,
            timeout: 20000,
            retries: 15
        }, opts));

        this.wallet = new Wallet({...opts, offlineMode: !(opts && opts.mnemonic)});

        let platformOpts: PlatformOpts = {
            client: this.client,
        };
        if (opts && opts.schema) {
            platformOpts.schema = opts && opts.schema;
        }

        this.platform = new Platform(platformOpts)
    }
}
