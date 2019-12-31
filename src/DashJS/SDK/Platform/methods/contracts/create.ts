import {Platform} from "../../Platform";
import {PublicKey} from "@dashevo/dashcore-lib";

// TODO: identity type should be in form of typing in JS-DPP
export async function create(this: Platform, identity: any, identifier: string, documentDefinitions: any): Promise<any> {
    const {client, apps} = this;

    const contractIdentity = identity;
    const identityPublicKey = contractIdentity.getPublicKeyById(1);


    const identityPublicKeyHex = Buffer
        .from(identityPublicKey.getData(), 'base64')
        .toString('hex');

    // @ts-ignore
    const publicKey = new PublicKey(identityPublicKeyHex);
    const address = publicKey.toAddress(this.network).toString();
    // @ts-ignore
    const [privateKey] = this.account
        .getPrivateKeys([address])
        // @ts-ignore
        .map(HDKey => HDKey.privateKey);

    const dataContract = this.dpp.dataContract.create(contractIdentity.getId(), documentDefinitions);
    const contractStateTransition = this.dpp.dataContract.createStateTransition(dataContract);

    contractStateTransition.sign(identityPublicKey, privateKey);

    // @ts-ignore
    await client.applyStateTransition(contractStateTransition);

    console.log(dataContract);
    apps[identifier]=dataContract;
    return dataContract;
}

export default create;
