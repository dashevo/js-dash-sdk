import {Platform} from "../../Platform";
// @ts-ignore
import Identifier from "@dashevo/dpp/lib/Identifier";

/**
 * Get an identity from the platform
 *
 * @param {Platform} this - bound instance class
 * @param {string} id - id
 * @returns Identity
 */
export async function get(this: Platform, id: string): Promise<any> {
    // @ts-ignore
    const identityBuffer = await this.client.getDAPIClient().platform.getIdentity(Identifier.from(id));

    if (identityBuffer === null) {
        return null;
    }

    return this.dpp.identity.createFromBuffer(identityBuffer);
}

export default get;
