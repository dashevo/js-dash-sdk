import { Platform } from "./Platform";
import { StateTransitionBroadcastError } from "../../../errors/StateTransitionBroadcastError";

/**
 * @param {Platform} platform
 * @param stateTransition
 */
export default async function broadcastStateTransition(platform: Platform, stateTransition: any) {
    const { client, dpp } = platform;

    const result = await dpp.stateTransition.validateStructure(stateTransition);

    if (!result.isValid()) {
        throw new Error(`StateTransition is invalid - ${JSON.stringify(result.getErrors())}`);
    }

    // Subscribing to future result
    const stateTransitionResultPromise = client.getDAPIClient().platform.waitForStateTransitionResult(stateTransition.hash());
    // Broadcasting state transition
    await client.getDAPIClient().platform.broadcastStateTransition(stateTransition.toBuffer());
    // Waiting for result to return
    const stateTransitionResult = await stateTransitionResultPromise;

    // @ts-ignore
    let { error: stateTransitionError } = stateTransitionResult;

    if (stateTransitionError) {
        throw new StateTransitionBroadcastError(stateTransitionError.code, stateTransitionError.log);
    }
}
