import {Platform} from "../../Platform";
import StateTransitionBuilder, {StateTransitionBuilderTypes} from "../../../StateTransitionBuilder/StateTransitionBuilder";

/**
 * Broadcast contract onto the platform
 *
 * @param {Platform} this - bound instance class
 * @param contract - contract
 * @param identity - identity
 */
export async function broadcast(this: Platform, contract: any, identity: any): Promise<any> {
    const {account, client, dpp} = this;

    const builder = new StateTransitionBuilder({type: StateTransitionBuilderTypes.CONTRACT, dpp, client});
    builder.addRecord(contract);
    // @ts-ignore
    const identityPrivateKey = account.getIdentityHDKey(0, 'user').privateKey;
    await builder.register(identity, identityPrivateKey);
}

export default broadcast;
