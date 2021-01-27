import crypto from "crypto";
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
    const hash = crypto.createHash('sha256')
      .update(stateTransition.toBuffer())
      .digest();

    const stateTransitionResultPromise = client.getDAPIClient().platform.waitForStateTransitionResult(hash, { prove: true });

    // Broadcasting state transition
    try {
        await client.getDAPIClient().platform.broadcastStateTransition(stateTransition.toBuffer());
    } catch (e) {
        throw new StateTransitionBroadcastError(e.code, e.message, e.data);
    }

    // Waiting for result to return
    const stateTransitionResult = await stateTransitionResultPromise;

    // @ts-ignore
    let { error } = stateTransitionResult;

    if (error) {
        throw new StateTransitionBroadcastError(error.code, error.message, error.data);
    }
}
