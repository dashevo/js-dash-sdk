import {Wallet} from "@dashevo/wallet-lib";
// FIXME: use dashcorelib types
import {Mnemonic, Network} from "@dashevo/wallet-lib/src/types/types";
import {Platform, PlatformOpts} from './Platform';
// @ts-ignore
import DAPIClient from "@dashevo/dapi-client"
import {Schema} from "inspector";

const defaultSeeds = [
    '18.236.131.253',
].map(ip => ({service: `${ip}:3000`}));


export type DPASchema = object

export interface SDKOpts {
    network?: Network | string,
    mnemonic?: Mnemonic | string,
    apps?: SDKApps
}

export type SDKClient = object | DAPIClient;

export interface SDKClients {
    [name: string]: SDKClient,
    dapi: DAPIClient
}
export interface SDKApps {
    [name:string]: {
        contractId: number,
        schema: DPASchema
    }
}

export class SDK {
    public network: string = 'testnet';
    public wallet: Wallet | undefined;
    public platform: Platform | undefined;
    private readonly clients: SDKClients;
    private readonly apps: SDKApps;

    constructor(opts: SDKOpts = {}) {
        this.network = opts.network || 'testnet';
        this.apps = opts.apps || {};
        this.clients = {
            dapi: new DAPIClient(Object.assign({
                seeds: defaultSeeds,
                timeout: 20000,
                retries: 15
            }, opts || {network: this.network}))
        }
        if(opts.mnemonic){
            // @ts-ignore
            this.wallet = new Wallet({...opts, offlineMode: !(opts.mnemonic)});
        }
        if(opts.apps !== undefined && Object.entries(opts.apps).length > 0){
            let platformOpts: PlatformOpts = {
                client: this.getDAPIInstance(),
                apps : this.getApps()
            };
            this.platform = new Platform(platformOpts)
        }
    }

    getDAPIInstance(){
        if (this.clients['dapi'] == undefined) {
            throw new Error(`There is no client DAPI`);
        }
        return this.clients['dapi'];
    }
    addApp(appName: string, contractId: number, schema: object){
        if(this.apps[appName]){
            throw new Error(`Already using an app named ${appName}`);
        }
        this.apps[appName] = {
            contractId,
            schema
        }
    }
    getApps():SDKApps{
        return this.apps;
    }
}
