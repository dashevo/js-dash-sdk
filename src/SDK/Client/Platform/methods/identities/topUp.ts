import {Platform} from "../../Platform";

import { wait } from "../../../../../utils/wait";
import createAssetLockTransaction from "../../createAssetLockTransaction";
import {PrivateKey} from "@dashevo/dashcore-lib";


function calculateTopUpTransitionFee(dpp, identityId, privateKey) {
    const staticOutPontBuffer = Buffer.alloc(36);

    const identityTopUpTransition = dpp.identity.createIdentityTopUpTransition(
        identityId,
        staticOutPontBuffer,
    );

    identityTopUpTransition.signByPrivateKey(privateKey);

    return identityTopUpTransition.calculateFee();
}


/**
 * Register identities to the platform
 *
 * @param {Platform} this - bound instance class
 * @param {string} identityId - id of the identity to top up
 * @param {number} amount - amount to top up in duffs
 * @returns {boolean}
 */
export async function topUp(this: Platform, identityId: string, amount: number): Promise<any> {
    const { client, dpp } = this;


    const assetLockOneTimePrivateKey = new PrivateKey();

    const topUpTransitionFee = calculateTopUpTransitionFee(dpp, identityId, assetLockOneTimePrivateKey);


    const account = await client.getWalletAccount();

    const {
        transaction: assetLockTransaction,
        privateKey: assetLockPrivateKey
    } = await createAssetLockTransaction(this, assetLockOneTimePrivateKey, amount + topUpTransitionFee);

    // Broadcast Asset Lock transaction
    await account.broadcastTransaction(assetLockTransaction);

    // Wait some time for propagation
    await wait(1000);

    // Create ST

    const outPointBuffer = assetLockTransaction.getOutPointBuffer(0);

    const identityTopUpTransition = dpp.identity.createIdentityTopUpTransition(identityId, outPointBuffer);

    identityTopUpTransition.signByPrivateKey(assetLockPrivateKey);

    const result = await dpp.stateTransition.validateStructure(identityTopUpTransition);

    if (!result.isValid()) {
        throw new Error(`StateTransition is invalid - ${JSON.stringify(result.getErrors())}`);
    }

    // Broadcast ST

    await client.getDAPIClient().platform.broadcastStateTransition(identityTopUpTransition.serialize());

    // Wait some time for propagation
    await wait(1000);

    return true;
}

export default topUp;
