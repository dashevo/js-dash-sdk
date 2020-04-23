import {Platform} from "../../Platform";

/**
 * Broadcast document onto the platform
 *
 * @param {Platform} this - bound instance class
 * @param documents - documents
 * @param identity - identity
 */
export default async function broadcast(this: Platform, documents: { create: any[], replace: any[], delete: any[]}, identity: any): Promise<any> {
    const { account, client, dpp } = this;

    const documentsBatchTransition = dpp.documents.createStateTransition(documents);

    // @ts-ignore
    const { privateKey } = account.getIdentityHDKey(0);

    documentsBatchTransition.sign(
        identity.getPublicKeyById(0),
        privateKey,
    );

    const result = await dpp.stateTransition.validateStructure(documentsBatchTransition);

    if (!result.isValid()) {
        throw new Error(`StateTransition is invalid - ${JSON.stringify(result.getErrors())}`);
    }

    await client.applyStateTransition(documentsBatchTransition);
}
