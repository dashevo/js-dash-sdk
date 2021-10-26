// @ts-ignore
import Identifier from "@dashevo/dpp/lib/Identifier";
import {PrivateKey} from "@dashevo/dashcore-lib";
import createAssetLockTransaction from "../../createAssetLockTransaction";
import createAssetLockProof from "./internal/createAssetLockProof";
import createIdentityTopUpTransition from "./internal/createIdnetityTopUpTransition";
import broadcastStateTransition from "../../broadcastStateTransition";

/**
 * @param {DashPlatformProtocol} dpp
 * @param {string} identityId
 * @param {PrivateKey} privateKey
 * @returns {number}
 */
function calculateTopUpTransitionFee(dpp: DashPlatformProtocol, identityId: string, privateKey: PrivateKey): number {
    const staticOutPointBuffer = Buffer.alloc(36);

    const identityTopUpTransition = dpp.identity.createIdentityTopUpTransition(
        identityId,
        staticOutPointBuffer,
    );

    identityTopUpTransition.signByPrivateKey(privateKey);

    return identityTopUpTransition.calculateFee();
}

/**
 * Register identities to the platform
 *
 * @param {Platform} this - bound instance class
 * @param {Identifier|string} identityId - id of the identity to top up
 * @param {number} amount - amount to top up in duffs
 * @returns {boolean}
 */
export async function topUp(this: Platform, identityId: Identifier | string, amount: number): Promise<any> {
    await this.initialize();

    const { client } = this;

    identityId = Identifier.from(identityId);

    // @ts-ignore
    const assetLockOneTimePrivateKey = new PrivateKey();

    const topUpTransitionFee = calculateTopUpTransitionFee(
        dpp,
        identityId,
        assetLockOneTimePrivateKey,
    );

    const account = await client.getWalletAccount();

    const {
        transaction: assetLockTransaction,
        privateKey: assetLockPrivateKey,
        outputIndex: assetLockOutputIndex
    } = await createAssetLockTransaction(this, amount);

    // Broadcast Asset Lock transaction
    await account.broadcastTransaction(assetLockTransaction);
    // Create a proof for the asset lock transaction
    const assetLockProof = await createAssetLockProof(this, assetLockTransaction, assetLockOutputIndex);

    // @ts-ignore
    const identityTopUpTransition = await createIdentityTopUpTransition(this, assetLockProof, assetLockPrivateKey, identityId);

    // Broadcast ST
    await broadcastStateTransition(this, identityTopUpTransition);

    return true;
}

export default topUp;
