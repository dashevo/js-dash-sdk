import {Platform} from "../../Platform";
import {PublicKey, PrivateKey, Transaction} from "@dashevo/dashcore-lib";
// @ts-ignore
import {utils} from "../../../../../../../wallet-lib";

const Identity = require('@dashevo/dpp/lib/identity/Identity');

//TODO Identity types is one of Identity.TYPES
export async function create(this: Platform, identityType: any): Promise<any> {
    const {client, account} = this;
    const burnAmount = 10000;

    if (account === undefined) {
        throw new Error(`A initialized wallet is required to create an Identity.`);
    }
    const hardenedFeatureKey = account.keyChain.getHardenedDIP9FeaturePath();
    const identityHDPrivateKey = hardenedFeatureKey
        // @ts-ignore
        .deriveChild(account.index, true)
        // @ts-ignore
        .deriveChild(0, false);
    const identityPrivateKey = identityHDPrivateKey.privateKey;

    const identityPublicKey = identityPrivateKey.publicKey;
    const identityAddress = identityPublicKey.toAddress().toString();
    const changeAddress = account.getUnusedAddress('internal').address;
    console.log('Identity Public Key', identityPublicKey.toString());
    console.log('Identity Public Address', identityAddress);

    let selection;
    try {
        // @ts-ignore
        const transaction = new Transaction();

        const output = {
            satoshis:burnAmount,
            address: identityAddress
        };

        const utxos = account.getUTXOS();
        const balance = account.getConfirmedBalance();
        if(balance<output.satoshis){
            throw new Error(`Not enought balance (${balance}) to cover burn amount of ${burnAmount}`)
        }
        selection = utils.coinSelection(utxos, [output]);
        transaction
            .from(selection.utxos)
            .addBurnOutput(output.satoshis, identityPublicKey._getID())
            .to(identityAddress, output.satoshis)
            // @ts-ignore
            .change(changeAddress)
            .fee(selection.estimatedFee)

        console.log('Estimated fee', selection.estimatedFee)
        const UTXOHDPrivateKey = account.getPrivateKeys(selection.utxos.map((utxo:any)=>utxo.address));

        // @ts-ignore
        const signingKeys = UTXOHDPrivateKey.map((hdprivateKey)=> hdprivateKey.privateKey);
        // signingKeys.push(identityPrivateKey);

        // @ts-ignore
        const signedTransaction = account.sign(transaction, signingKeys);

        throw new Error('Not implemented ');
        // const txId = await account.broadcastTransaction(transaction.serialize());
        // console.log(txId);

        // const outPoint = transaction.getOutPointBuffer(0).toString('base64');
        // const identityCreateTransition = this.dpp.stateTransition.createStateTransition({
        //     protocolVersion: 0,
        //     type: stateTransitionTypes.IDENTITY_CREATE,
        //     lockedOutPoint: outPoint,
        //     identityType: identityType,
        //     publicKeys: [
        //         {
        //             id: publicKeyId,
        //             type: IdentityPublicKey.TYPES.ECDSA_SECP256K1,
        //             data: identityPublicKeyBase,
        //             isEnabled: true,
        //         },
        //     ],
        // });
        // const identityPublicKeyModel = new IdentityPublicKey()
        //     .setId(publicKeyId)
        //     .setType(IdentityPublicKey.TYPES.ECDSA_SECP256K1)
        //     .setData(identityPublicKeyBase);
        //
        // identityCreateTransition.sign(identityPublicKeyModel, identityPrivateKey);
        //
        // const result = await this.dapiClient.applyStateTransition(identityCreateTransition);
        //
        // return identityCreateTransition.getIdentityId();

    } catch (e) {
        throw e
    }
}

export default create;
