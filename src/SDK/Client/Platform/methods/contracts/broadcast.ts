/**
 * Broadcast contract onto the platform
 *
 * @param {Platform} this - bound instance class
 * @param contract - contract
 * @param identity - identity
 */
import {Platform} from "../../Platform";

export default async function broadcast(this: Platform, dataContract: [any], identity: any): Promise<any> {
    const { account, client, dpp} = this;

    const dataContractCreateTransition = dpp.dataContract.createStateTransition(dataContract);

    // @ts-ignore
    const { privateKey } = account.getIdentityHDKey(0);

    dataContractCreateTransition.sign(
        identity.getPublicKeyById(0),
        privateKey,
    );

    const result = await this.dpp.stateTransition.validateStructure(dataContractCreateTransition);

    if (!result.isValid()) {
        throw new Error(`StateTransition is invalid - ${JSON.stringify(result.getErrors())}`);
    }

    await client.applyStateTransition(dataContractCreateTransition);
}
