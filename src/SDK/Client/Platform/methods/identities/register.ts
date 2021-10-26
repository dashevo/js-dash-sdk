import { Platform } from "../../Platform";
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

    const assetLockTransaction = await createAssetLockTransaction(this, assetLockOneTimePrivateKey, fundingAmount);

    const {
        transaction: assetLockTransaction,
        privateKey: assetLockPrivateKey
        outputIndex: assetLockOutputIndex,
    } = await createAssetLockTransaction(this, fundingAmount);

    // Broadcast Asset Lock transaction
    await account.broadcastTransaction(assetLockTransaction);
    const assetLockProof = await createAssetLockProof(this, assetLockTransaction, assetLockOutputIndex);

    const { identity, identityCreateTransition, identityIndex } = await createIdentityCreateTransition(
        this, assetLockProof, assetLockPrivateKey
    );
    await broadcastStateTransition(this, identityCreateTransition);

    // const { identity, identityCreateTransition, identityIndex } = await createIdentityCreateTransition(
    //     this, assetLockProof, assetLockPrivateKey
    // );
    // await broadcastStateTransition(this, identityCreateTransition);


    const identityIndex = await account.getUnusedIdentityIndex();

    // @ts-ignore
    const { privateKey: identityPrivateKey } = account.getIdentityHDKeyByIndex(identityIndex, 0);
    const identityPublicKey = identityPrivateKey.toPublicKey();

    const identity = dpp.identity.create(assetLockOutPoint, [identityPublicKey]);

    // Create ST
    const identityCreateTransition = dpp.identity.createIdentityCreateTransition(identity);

    identityCreateTransition.signByPrivateKey(assetLockOneTimePrivateKey);

    const result = await dpp.stateTransition.validateStructure(identityCreateTransition);

    if (!result.isValid()) {
        throw new Error(`StateTransition is invalid - ${JSON.stringify(result.getErrors())}`);
    }

    // Broadcast ST
    await client.getDAPIClient().platform.broadcastStateTransition(identityCreateTransition.serialize());

    account.storage.insertIdentityIdAtIndex(
        account.walletId,
        identity.getId().toString(),
        identityIndex,
    );

    return identity;
}
