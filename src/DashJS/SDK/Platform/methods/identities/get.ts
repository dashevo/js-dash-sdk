import {Platform} from "../../Platform";

export async function get(this: Platform, id: string): Promise<any> {
    // FIXME : we might want to update client definitions
    // @ts-ignore
    return this.client.getIdentity(id);

}

export default get;
