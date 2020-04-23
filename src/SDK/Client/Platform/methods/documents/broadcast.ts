import {Platform} from "../../Platform";
import broadcastStateTransition from '../../broadcastStateTransition';

/**
 * Broadcast document onto the platform
 *
 * @param {Platform} this - bound instance class
 * @param documents - documents
 * @param identity - identity
 */
export default async function broadcast(this: Platform, documents: { create: any[], replace: any[], delete: any[]}, identity: any): Promise<any> {
    const { dpp } = this;

    const documentsBatchTransition = dpp.documents.createStateTransition(documents);

    await broadcastStateTransition(this, documentsBatchTransition, identity);
}
