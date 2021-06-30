import {Platform} from "../../Platform";
// @ts-ignore
import Identifier from "@dashevo/dpp/lib/Identifier";
import Metadata from "@dashevo/dpp/lib/Metadata";

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

    // @ts-ignore
    const identityResponse = await this.client.getDAPIClient().platform.getIdentity(identifier);

    const identityBuffer = identityResponse.getIdentity();

    if (identityBuffer === null) {
        return null;
    }

    const identity = this.dpp.identity.createFromBuffer(identityBuffer);

    let metadata = null;
    const responseMetadata = identityResponse.getMetadata();
    if (responseMetadata) {
        metadata = new Metadata({
            blockHeight: responseMetadata.getHeight(),
            coreChainLockedHeight: responseMetadata.getCoreChainLockedHeight(),
        });
    }
    identity.setMetadata(metadata);

    return identity;
}

export default get;
