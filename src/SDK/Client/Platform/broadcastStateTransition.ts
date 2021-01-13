import { Platform } from "./Platform";
import { TransitionBroadcastError } from "../../../errors/TransitionBroadcastError";

/**
 * @param {Platform} platform
 * @param stateTransition
 * @param identity
 * @param {number} [keyIndex=0]
 */
export default async function broadcastStateTransition(platform: Platform, stateTransition: any) {
    const { client, dpp } = platform;

    const result = await dpp.stateTransition.validateStructure(stateTransition);

    if (!result.isValid()) {
        throw new Error(`StateTransition is invalid - ${JSON.stringify(result.getErrors())}`);
    }

    const [ stateTransitionResult, ] = await Promise.all([
        client.getDAPIClient().platform.waitForStateTransitionResult(stateTransition.hash()),
        new Promise(resolve => {
            setTimeout(async () => {
                const res = await client.getDAPIClient().platform.broadcastStateTransition(stateTransition.toBuffer());
                resolve(res);
            }, 1)
        }),
    ]);

    // @ts-ignore
    let { error: stateTransitionError } = stateTransitionResult;

    if (stateTransitionError) {
        throw new TransitionBroadcastError(stateTransitionError.code, stateTransitionError.log);
    }
}
