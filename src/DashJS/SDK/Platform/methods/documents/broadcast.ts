import {Platform} from "../../Platform";
import StateTransitionBuilder, {StateTransitionBuilderTypes} from "../../../StateTransitionBuilder/StateTransitionBuilder";

/**
 * Broadcast document onto the platform
 *
 * @param {Platform} this - bound instance class
 * @param document - document
 * @param identity - identity
 */
export async function broadcast(this: Platform, document: any, identity: any): Promise<any> {
    const {account, client, dpp} = this;

    const builder = new StateTransitionBuilder({type: StateTransitionBuilderTypes.DOCUMENT, dpp, client});
    builder.addRecord(document);
    // @ts-ignore
    const identityPrivateKey = account.getIdentityHDKey(0, 'user').privateKey;
    await builder.register(identity, identityPrivateKey);
}

export default broadcast;
