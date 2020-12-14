import { Platform } from "../../Platform";
import { wait } from "../../../../../utils/wait";
import createAssetLockTransaction from "../../createAssetLockTransaction";
import createIdentityTransition from "./internal/createIdentityTransition";
import broadcastIdentityCreateStateTransition from "./internal/broadcastIdentityCreateTransition";

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
    const { client } = this;

    const account = await client.getWalletAccount();

    const {
        transaction: assetLockTransaction,
        privateKey: assetLockPrivateKey,
        outputIndex: assetLockOutputIndex
    } = await createAssetLockTransaction(this, fundingAmount);

    // Broadcast Asset Lock transaction
    await account.broadcastTransaction(assetLockTransaction);

    // Wait some time for propagation
    await wait(1000);

    const { identity, identityCreateTransition, identityIndex } = await createIdentityTransition(
        this, assetLockTransaction, assetLockOutputIndex, assetLockPrivateKey
    );

    await broadcastIdentityCreateStateTransition(this, identityCreateTransition, identity, identityIndex);

    let fetchedIdentity;
    do {
        await wait(1000);

        fetchedIdentity = await this.client.getDAPIClient().platform.getIdentity(identity.getId());
    } while (!fetchedIdentity);

    return identity;
}
