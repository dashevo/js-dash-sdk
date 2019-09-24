// @ts-ignore
import DashPlatformProtocol from "@dashevo/dpp";


export class Platform {
    private dpp: DashPlatformProtocol;
    private contractId: any;
    private client: any;

    constructor(opts: any) {
        this.dpp = new DashPlatformProtocol(opts);
        this.client = opts.client;
        this.setCurrentContract(opts.schema);
    }


    async fetchDocuments(type: string, opts: object) {
        return this.client.fetchDocuments(this.contractId, type, opts);
    }

    private setCurrentContract(schema: { name: any; }) {
        const contract = this.dpp.contract.create(schema.name, schema);

        this.dpp.setContract(contract);

        this.contractId = this.dpp.getContract().getId();
    }


}
