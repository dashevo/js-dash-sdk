import {Platform} from "../../Platform";

export async function get(this: Platform, id: string): Promise<any> {
    //FIXME : Where query have an issue here failing with Error 3.
    // const queryOpts = {
    //     where: [
    //         ['label', '==', id.toLowerCase()],
    //     ],
    // }
    const queryOpts = {};
    const documents = await this.documents.get('dpns.domain', queryOpts);

    const names = documents.filter((el: { data: { label: string; }; }) => el.data.label === id);
    return names[0] || {};
}

export default get;
