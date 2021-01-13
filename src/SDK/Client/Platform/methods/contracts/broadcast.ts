/**
 * Broadcast contract onto the platform
 *
 * @param {Platform} this - bound instance class
 * @param dataContract - contract
 * @param identity - identity
 * @return dataContract
 */
import { wait } from '../../../../../utils/wait';
import { Platform } from "../../Platform";
import broadcastStateTransition from "../../broadcastStateTransition";
import {signStateTransition} from "../../signStateTransition";

export default async function broadcast(this: Platform, dataContract: any, identity: any): Promise<any> {
    const { dpp } = this;

    const dataContractCreateTransition = dpp.dataContract.createStateTransition(dataContract);

    await signStateTransition(this, dataContractCreateTransition, identity);
    await broadcastStateTransition(this, dataContractCreateTransition);

    // Wait some time for propagation
    await wait(6000);

    let fetchedContract;
    do {
        await wait(1000);

        fetchedContract = await this.client.getDAPIClient().platform.getDataContract(dataContract.getId());
    } while (!fetchedContract);

    return dataContractCreateTransition;
}
