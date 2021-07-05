import {Platform} from "../../Platform";
// @ts-ignore
import Identifier from "@dashevo/dpp/lib/Identifier";
import Metadata from "@dashevo/dpp/lib/Metadata";
const grpcErrorCodes = require('@dashevo/grpc-common/lib/server/error/GrpcErrorCodes');

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
        if (e?.getCode() === grpcErrorCodes.NOT_FOUND) {
            return null;
        }

        throw e;
    }

    const identity = this.dpp.identity.createFromBuffer(identityResponse.getIdentity());

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
