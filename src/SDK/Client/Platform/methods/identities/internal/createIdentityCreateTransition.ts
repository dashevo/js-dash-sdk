import { PrivateKey } from "@dashevo/dashcore-lib";
import { Platform } from "../../../Platform";

/**
 * Creates a funding transaction for the platform identity and returns one-time key to sign the state transition
 * @param {Platform} platform
 * @param {AssetLockProof} assetLockProof - asset lock transaction proof for the identity create transition
 * @param {PrivateKey} assetLockPrivateKey - private key used in asset lock
 * @return {{identity: Identity, identityCreateTransition: IdentityCreateTransition}} - identity, state transition and index of the key used to create it
 * that can be used to sign registration/top-up state transition
 */
export default async function createIdentityCreateTransition(platform : Platform, assetLockProof: any, assetLockPrivateKey: PrivateKey): Promise<{ identity: any, identityCreateTransition: any, identityIndex: number }> {
    await platform.initialize();

    const account = await platform.client.getWalletAccount();
    const { dpp } = platform;

    const identityIndex = await account.getUnusedIdentityIndex();

    // @ts-ignore
    const { privateKey: identityPrivateKey } = account.identities.getIdentityHDKeyByIndex(identityIndex, 0);
    const identityPublicKey = identityPrivateKey.toPublicKey();

    // Create Identity
    // @ts-ignore
    const identity = dpp.identity.create(
        assetLockProof, [identityPublicKey]
    );

    // Create ST
    const identityCreateTransition = dpp.identity.createIdentityCreateTransition(identity);

    identityCreateTransition.signByPrivateKey(assetLockPrivateKey);

    const result = await dpp.stateTransition.validateBasic(identityCreateTransition);

    if (!result.isValid()) {
        throw new Error(`StateTransition is invalid - ${JSON.stringify(result.getErrors())}`);
    }

    return { identity, identityCreateTransition, identityIndex };
}
