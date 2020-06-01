import {Platform} from "../../Platform";

/**
 * Get identies from the platform
 *
 * @param {Platform} this - bound instance class
 * @param {string} id - id
 * @returns identites
 */
export async function get(this: Platform, id: string): Promise<any> {
    const { client: dapiClient } = await this.client.getDAPIClient();

    const identityBuffer = await dapiClient.getIdentity(id);

    if (identityBuffer === null) {
        return null;
    }

    return this.dpp.identity.createFromSerialized(identityBuffer);
}

export default get;
