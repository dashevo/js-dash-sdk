import { PrivateKey, Transaction } from "@dashevo/dashcore-lib";
import { Platform } from "../../../Platform";
import { createFakeInstantLock } from "../../../../../../utils/createFakeIntantLock";

/**
 * Creates a funding transaction for the platform identity and returns one-time key to sign the state transition
 * @param {Platform} platform
 * @param {Transaction} assetLockTransaction
 * @param {number} assetLockOutputIndex - index of the funding output in the asset lock transaction
 * @param {PrivateKey} assetLockPrivateKey - private key used in asset lock
 * @return {{identity: Identity, identityCreateTransition: IdentityCreateTransition}} - identity, state transition and index of the key used to create it
 * that can be used to sign registration/top-up state transition
 */
export default async function createIdentityTransition(platform : Platform, assetLockTransaction: Transaction, assetLockOutputIndex: number, assetLockPrivateKey: PrivateKey): Promise<{ identity: any, identityCreateTransition: any, identityIndex: number }> {
    const account = await platform.client.getWalletAccount();
    const { dpp, passFakeAssetLockProofForTests } = platform;

    const identityIndex = await account.getUnusedIdentityIndex();

    // @ts-ignore
    const { privateKey: identityPrivateKey } = account.getIdentityHDKeyByIndex(identityIndex, 0);
    const identityPublicKey = identityPrivateKey.toPublicKey();

    let instantLock;
    // Create poof that the transaction won't be double spend
    if (passFakeAssetLockProofForTests) {
        instantLock = createFakeInstantLock(assetLockTransaction.hash);
    } else {
        instantLock = await account.waitForInstantLock(assetLockTransaction.hash);
    }
    // @ts-ignore
    const assetLockProof = await dpp.identity.createInstantAssetLockProof(instantLock);

    // Create Identity
    // @ts-ignore
    const identity = dpp.identity.create(
        assetLockTransaction, assetLockOutputIndex, assetLockProof, [identityPublicKey]
    );

    // Create ST
    const identityCreateTransition = dpp.identity.createIdentityCreateTransition(identity);

    identityCreateTransition.signByPrivateKey(assetLockPrivateKey);

    const result = await dpp.stateTransition.validateStructure(identityCreateTransition);

    if (!result.isValid()) {
        throw new Error(`StateTransition is invalid - ${JSON.stringify(result.getErrors())}`);
    }

    return { identity, identityCreateTransition, identityIndex };
}
