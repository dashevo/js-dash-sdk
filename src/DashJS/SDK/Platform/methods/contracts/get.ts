import {Platform} from "../../Platform";

declare type ContractIdentifier = string;

export async function get(this: Platform, identifier: ContractIdentifier): Promise<any> {
    // TODO : if identifier is contractId then fetch directly
    // if not, fetch from dpns the contract id and fetch it

    // @ts-ignore
    const contract = await this.client.getDataContract(identifier);
    return this.dpp.dataContract.createFromSerialized(contract);
}

export default get;
