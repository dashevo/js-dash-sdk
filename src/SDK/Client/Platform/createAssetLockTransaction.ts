import { PrivateKey, Transaction } from "@dashevo/dashcore-lib";
import { utils } from "@dashevo/wallet-lib";
import { Platform } from "./Platform";
import {kill} from "process";

// We're creating a new transaction every time and the index is always 0
export const ASSET_LOCK_OUTPUT_INDEX = 0;

/**
 * Creates a funding transaction for the platform identity and returns one-time key to sign the state transition
 * @param {Platform} platform
 * @param {PrivateKey} assetLockOneTimePrivateKey - one time private key
 * that can be used to sign registration/top-up state transition
 * @param {number} fundingAmount - amount of dash to fund the identity's credits
 * @return {Transaction} - transaction
 */
export default async function createAssetLockTransaction(
    platform : Platform,
    assetLockOneTimePrivateKey: PrivateKey,
    fundingAmount
): Promise<Transaction> {
    const account = await platform.client.getWalletAccount();

    const assetLockOneTimePublicKey = assetLockOneTimePrivateKey.toPublicKey();

    const identityAddress = assetLockOneTimePublicKey.toAddress(platform.client.network).toString();

    const changeAddress = account.getUnusedAddress('internal').address;

    const lockTransaction = new Transaction(undefined);

    const output = {
        satoshis: fundingAmount,
        address: identityAddress
    };

    const utxos = account.getUTXOS();
    const balance = account.getTotalBalance();

    if (balance < output.satoshis) {
        throw new Error(`Not enough balance (${balance}) to cover burn amount of ${fundingAmount}`);
    }

    const selection = utils.coinSelection(utxos, [output]);

    lockTransaction
        // @ts-ignore
        .from(selection.utxos)
        // @ts-ignore
        .addBurnOutput(output.satoshis, assetLockOneTimePublicKey._getID())
        .change(changeAddress);

    const utxoAddresses = selection.utxos.map((utxo: any) => utxo.address.toString());

    // @ts-ignore
    const utxoHDPrivateKey = account.getPrivateKeys(utxoAddresses);

    // @ts-ignore
    const signingKeys = utxoHDPrivateKey.map((hdprivateKey) => hdprivateKey.privateKey);

    return lockTransaction.sign(signingKeys);
}
