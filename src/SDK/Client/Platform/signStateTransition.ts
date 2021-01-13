import {Platform} from "./Platform";

export async function signStateTransition(platform: Platform, stateTransition: any, identity: any, keyIndex: number = 0) {
    const { client } = platform;

    const account = await client.getWalletAccount();

    // @ts-ignore
    const { privateKey } = account.getIdentityHDKeyById(
        identity.getId().toString(),
        keyIndex,
    );

    stateTransition.sign(
        identity.getPublicKeyById(keyIndex),
        privateKey,
    );
}