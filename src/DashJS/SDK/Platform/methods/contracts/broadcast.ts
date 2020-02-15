import {Platform} from "../../Platform";

/**
 * Broadcast contract onto the platform
 * 
 * @param {Platform} this - bound instance class
 * @param contract - contract
 * @param identity - identity
 */
export async function broadcast(this: Platform, contract: any, identity: any): Promise<any> {
    const {account, client, dpp} = this;

    // @ts-ignore
    const identityHDPrivateKey = account.getIdentityHDKey(0, 'user');

    // @ts-ignore
    const identityPrivateKey = identityHDPrivateKey.privateKey;

    const stateTransition = dpp.dataContract.createStateTransition([contract]);
    stateTransition.sign(identity.getPublicKeyById(1), identityPrivateKey);

    // @ts-ignore
    await client.applyStateTransition(stateTransition);

}

export default broadcast;
