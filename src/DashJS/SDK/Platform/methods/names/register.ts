import {Identity} from '@dashevo/dpp/lib/identity/Identity';
import {Platform} from "../../Platform";

export async function register(this: Platform, identityType: string = 'USER', identity: any): Promise<any> {
    throw new Error('Implementation missing in dependencies.');
}

export default register;
