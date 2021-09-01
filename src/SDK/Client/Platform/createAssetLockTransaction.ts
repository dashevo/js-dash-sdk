import { PrivateKey, Transaction } from "@dashevo/dashcore-lib";
import { utils } from "@dashevo/wallet-lib";
import { Platform } from "./Platform";

// We're creating a new transaction every time and the index is always 0
const ASSET_LOCK_OUTPUT_INDEX = 0;

/**
 * Creates a funding transaction for the platform identity and returns one-time key to sign the state transition
 * @param {Platform} platform
 * @param {number} fundingAmount - amount of dash to fund the identity's credits
 * @return {{transaction: Transaction, privateKey: PrivateKey}} - transaction and one time private key
 * that can be used to sign registration/top-up state transition
 */
export default async function createAssetLockTransaction(platform : Platform, fundingAmount): Promise<{ transaction: Transaction, privateKey: PrivateKey, outputIndex: number }> {
    const account = await platform.client.getWalletAccount();

    // @ts-ignore
    const assetLockOneTimePrivateKey = new PrivateKey();
    const assetLockOneTimePublicKey = assetLockOneTimePrivateKey.toPublicKey();

    const identityAddress = assetLockOneTimePublicKey.toAddress(platform.client.network).toString();
    console.dir({identityAddress}, {depth:null});

    const changeAddress = account.getUnusedAddress('internal').address;

    const lockTransaction = new Transaction(undefined);

    const output = {
        satoshis: fundingAmount,
        address: identityAddress
    };

    const utxos = account.getUTXOS();
    const balance = account.getTotalBalance();
    console.log({utxos});
    console.dir({balance}, {depth:null});

    if (balance < output.satoshis) {
        throw new Error(`Not enough balance (${balance}) to cover burn amount of ${fundingAmount}`);
    }

    const selection = utils.coinSelection(utxos, [output]);
    console.dir({selection}, {depth:2});
    lockTransaction
        .from(selection.utxos)
        // @ts-ignore
        .addBurnOutput(output.satoshis, assetLockOneTimePublicKey._getID())
        .change(changeAddress);
    console.log({lockTransaction});

    const utxoAddresses = selection.utxos.map((utxo: any) => utxo.address.toString());
    console.log({utxoAddresses});

    // @ts-ignore
    const utxoHDPrivateKey = account.getPrivateKeys(utxoAddresses);
    console.log({utxoHDPrivateKey});

    // @ts-ignore
    const signingKeys = utxoHDPrivateKey.map((hdprivateKey) => hdprivateKey.privateKey);
    console.dir({signingKeys}, {depth:2});

    const transaction = lockTransaction.sign(signingKeys);
    console.log({lockSignedTransaction: transaction});

    return {
        transaction,
        privateKey: assetLockOneTimePrivateKey,
        outputIndex: ASSET_LOCK_OUTPUT_INDEX,
    };
}
