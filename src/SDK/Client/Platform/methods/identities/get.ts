import {Platform} from "../../Platform";
// @ts-ignore
import Identifier from "@dashevo/dpp/lib/Identifier";
import Metadata from "@dashevo/dpp/lib/Metadata";
const NotFoundError = require('@dashevo/dapi-client/lib/methods/errors/NotFoundError');

/**
 * Get an identity from the platform
 *
 * @param {Platform} this - bound instance class
 * @param {string|Identifier} id - id
 * @returns Identity
 */
export async function get(this: Platform, id: Identifier|string): Promise<any> {
    await this.initialize();

    const identifier = Identifier.from(id);

    let identityResponse;
    try {
        identityResponse = await this.client.getDAPIClient().platform.getIdentity(identifier);
    } catch (e) {
        if (e instanceof NotFoundError) {
            return null;
        }

        throw e;
    }

    const identity = this.dpp.identity.createFromBuffer(identityResponse.getIdentity());
    identity.setMetadata(identityResponse.getMetadata());

    return identity;
}

export default get;
