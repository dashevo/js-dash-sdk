import { Platform } from "../../Platform";
import { ASSET_LOCK_OUTPUT_INDEX } from "../../createAssetLockTransaction";
import createAssetLockTransaction from "../../createAssetLockTransaction";
import { PrivateKey } from "@dashevo/dashcore-lib";
import createIdentityCreateTransition from "./internal/createIdentityCreateTransition";
import createAssetLockProof from "./internal/createAssetLockProof";
import broadcastStateTransition from "../../broadcastStateTransition";

/**
 * Register identities to the platform
 *
 * @param {number} [fundingAmount=10000] - funding amount in duffs
 * @returns {Identity} identity - a register and funded identity
 */
export default async function register(
  this: Platform,
  fundingAmount : number = 10000
): Promise<any> {
    await this.initialize();

    const { client } = this;

    const account = await client.getWalletAccount();

    // @ts-ignore
    const assetLockOneTimePrivateKey = new PrivateKey();

    const assetLockTransaction = await createAssetLockTransaction(
        this,
        assetLockOneTimePrivateKey,
        fundingAmount,
    );

    // Broadcast Asset Lock transaction
    await account.broadcastTransaction(assetLockTransaction);

    const assetLockProof = await createAssetLockProof(
        this,
        assetLockTransaction,
        ASSET_LOCK_OUTPUT_INDEX,
    );

    const { identity, identityCreateTransition, identityIndex } = await createIdentityCreateTransition(
        this,
        assetLockProof,
        assetLockOneTimePrivateKey,
    );

    await broadcastStateTransition(this, identityCreateTransition);

    account.storage.insertIdentityIdAtIndex(
        account.walletId,
        identity.getId().toString(),
        identityIndex,
    );

    return identity;
}
