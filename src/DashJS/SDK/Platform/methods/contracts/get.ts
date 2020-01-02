import {Platform} from "../../Platform";

declare type ContractIdentifier = string;

export async function get(this: Platform, identifier: ContractIdentifier): Promise<any> {
    let localContract;

    for (let appName in this.apps) {
        const app = this.apps[appName];
        if (app.contractId === identifier && app.contract !== undefined) {
            localContract = app;
        }
    }

    if (localContract) {
        return localContract.contract;
    } else {
        // @ts-ignore
        const rawContract = await this.client.getDataContract(identifier)
        const contract = this.dpp.dataContract.createFromSerialized(rawContract);
        return this.apps[Date.now()] = {contractId: identifier, contract};
    }
}

export default get;
