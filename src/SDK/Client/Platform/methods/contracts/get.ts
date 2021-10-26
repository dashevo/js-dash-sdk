import {Platform} from "../../Platform";

// @ts-ignore
import Identifier from "@dashevo/dpp/lib/Identifier";
import Metadata from "@dashevo/dpp/lib/Metadata";
const NotFoundError = require('@dashevo/dapi-client/lib/transport/GrpcTransport/errors/NotFoundError');

declare type ContractIdentifier = string | Identifier;

/**
 * Get contracts from the platform
 *
 * @param {Platform} this - bound instance class
 * @param {ContractIdentifier} identifier - identifier of the contract to fetch
 * @returns contracts
 */
export async function get(this: Platform, identifier: ContractIdentifier): Promise<any> {
    await this.initialize();

    let localContract;
    const contractId : Identifier = Identifier.from(identifier);

    localContract = this.client.getApps().get(contractId);

    // Fetch contract otherwise
    let dataContractResponse;
    try {
        dataContractResponse = await this.client.getDAPIClient().platform.getDataContract(contractId);
    } catch (e) {
        if (e instanceof NotFoundError) {
            return null;
        }

        throw e;
    }

    const contract = await this.dpp.dataContract.createFromBuffer(dataContractResponse.getDataContract());

    let metadata = null;
    const responseMetadata = dataContractResponse.getMetadata();
    if (responseMetadata) {
        metadata = new Metadata({
            blockHeight: responseMetadata.getHeight(),
            coreChainLockedHeight: responseMetadata.getCoreChainLockedHeight(),
        });
    }
    contract.setMetadata(metadata);

    // Store contract to the cache

    this.client.getApps().set(contractId, {
        contract,
    });

    return contract;
}

export default get;
