// @ts-ignore
import DashPlatformProtocol from "@dashevo/dpp";
import {Mnemonic, Network} from "@dashevo/wallet-lib/src/types";
// @ts-ignore
import DAPIClient from "@dashevo/dapi-client"

export interface PlatformOpts {
  schema?: object;
  client: DAPIClient;
}

export class Platform {
    private dpp: DashPlatformProtocol;
    contractId: any;
    private client: DAPIClient;

    constructor(opts?: PlatformOpts) {
        if(opts){
            this.dpp = new DashPlatformProtocol(opts);
            this.client = opts.client;
            if(opts.schema){
                this.setCurrentContract(opts.schema);
            }
        }
    }


    async fetchDocuments(type: string, opts: object) {
        return this.client.fetchDocuments(this.contractId, type, opts);
    }

    private setCurrentContract(schema: object) {
        // @ts-ignore
        const contract = this.dpp.contract.create(schema.name, schema);

        this.dpp.setContract(contract);

        this.contractId = this.dpp.getContract().getId();
    }


}
