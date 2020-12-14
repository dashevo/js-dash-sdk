import {Platform} from "../../../Platform";

export default async function broadcastIdentityCreateStateTransition(platform: Platform, identityCreateTransition: any, identity: any, identityIndex: number) {
    const account = await platform.client.getWalletAccount();
    const { client } = platform;

    await client.getDAPIClient().platform.broadcastStateTransition(identityCreateTransition.toBuffer());

    // If state transition was broadcast without any errors, import identity to the account
    account.storage.insertIdentityIdAtIndex(
        account.walletId,
        identity.getId().toString(),
        identityIndex,
    );
}