import {Platform} from "../../Platform";

/**
 * Get names from the platform
 * @param {Platform} this - bound instance class
 * @param {string} typeLocator type locator
 * @param {string} id - id
 * @returns documents
 */
export async function getById(this: Platform, typeLocator: string, id: string): Promise<any> {
    const queryOpts = {
        where: [
            ['$id', '==', id]
        ],
    };
    const documents = await this.documents.get(typeLocator, queryOpts);
    return (documents[0] !== undefined) ? documents[0] : null;
};

export default getById;
