import {Platform} from "../../Platform";

// @ts-ignore
import Identifier from "@dashevo/dpp/lib/Identifier";

declare type ContractIdentifier = string | Identifier;

/**
 * Get contracts from the platform
 *
 * @param {Platform} this - bound instance class
 * @param {ContractIdentifier} identifier - identifier of the contract to fetch
 * @returns contracts
 */
export async function get(this: Platform, identifier: ContractIdentifier): Promise<any> {
    let localContract;

    identifier = Identifier.from(identifier);

    const identifierString = identifier.toString();

    for (let appName in this.apps) {
        const app = this.apps[appName];
        if (app.contractId === identifierString) {
            localContract = app;
            break;
        }
    }

    if (localContract && localContract.contract) {
        return localContract.contract;
    } else {
        // @ts-ignore
        const rawContract = await this.client.getDAPIClient().platform.getDataContract(identifier);

        if(!rawContract){
            return null;
        }

        const contract = await this.dpp.dataContract.createFromBuffer(rawContract);

        const app = {contractId: identifierString, contract};

        // If we do not have even the identifier in this.apps, we add it with timestamp as key
        if (localContract === undefined || !localContract.contract) {
            this.apps[Date.now()] = app;
        }
        return app.contract;
    }
}

export default get;
