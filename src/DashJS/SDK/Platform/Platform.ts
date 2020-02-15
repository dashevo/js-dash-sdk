// @ts-ignore
import DashPlatformProtocol from "@dashevo/dpp";
// @ts-ignore
import DAPIClient from "@dashevo/dapi-client"
import {SDKClients, SDKApps} from "../SDK";

import broadcastDocument from "./methods/documents/broadcast";
import createDocument from "./methods/documents/create";
import getDocument from "./methods/documents/get";

import broadcastContract from "./methods/contracts/broadcast";
import createContract from "./methods/contracts/create";
import getContract from "./methods/contracts/get";


import getIdentity from "./methods/identities/get";
import registerIdentity from "./methods/identities/register";

import getName from "./methods/names/get";
import registerName from "./methods/names/register";

// @ts-ignore
import {Account} from "@dashevo/wallet-lib";

/**
 * Interface for PlatformOpts
 * 
 * @remarks
 * required parameters include { client, apps }
 * optional parameters include { ..., account?, network? }
 */
export interface PlatformOpts {
    client: DAPIClient,
    apps: SDKApps
    account?: Account,
    network?: string
}

/**
 * Class for Dash Platform
 * 
 * @param documents - documents
 * @param identities - identites
 * @param names - names
 * @param contracts - contracts
 */
export class Platform {
    dpp: DashPlatformProtocol;
    /**
     * @param {Function} broadcast - broadcast documents onto the platform
     * @param {Function} create - create documents which can be broadcasted
     * @param {Function} get - get documents from the platform
     */
    public documents: {
        broadcast:Function,
        create:Function,
        get:Function,
    };
    /**
     * @param {Function} get - get identities from the platform
     * @param {Function} register - register identities on the platform
     */
    public identities: {
        get:Function,
        register:Function,
    };
    /**
     * @param {Function} get - get names from the platform
     * @param {Function} register - register names on the platform
     */
    public names: {
        get:Function,
        register:Function,
    };
    /**
     * @param {Function} get - get contracts from the platform
     * @param {Function} create - create contracts which can be broadcasted
     * @param {Function} register - register contracts on the platform
     */
    public contracts: {
        broadcast:Function,
        create:Function,
        get:Function
    };
    client: DAPIClient;
    apps: SDKApps;
    account?: Account;
    network?: string;

    /**
     * Construct some instance of Platform
     * 
     * @param {platformOpts} - options for Platform
     */
    constructor(platformOpts: PlatformOpts) {
        this.documents = {
            broadcast: broadcastDocument.bind(this),
            create: createDocument.bind(this),
            get: getDocument.bind(this),
        };
        this.contracts = {
            broadcast: broadcastContract.bind(this),
            create: createContract.bind(this),
            get: getContract.bind(this),
        };
        this.names = {
            register: registerName.bind(this),
            get: getName.bind(this),
        }
        this.identities = {
            register: registerIdentity.bind(this),
            get: getIdentity.bind(this),
        };
        this.dpp = new DashPlatformProtocol(platformOpts);
        this.client = platformOpts.client;
        this.apps = platformOpts.apps;
        this.network = platformOpts.network;

        if(platformOpts.account){
            this.account = platformOpts.account;
        }
    }
}
