import {Platform} from "../../Platform";

export async function get(this: Platform, id: string): Promise<any> {
    //FIXME : Where query has an issue here.
    // const documents = await this.documents.get('dpns.domain', { where: [[`data.label`, '==', id]] });
    const documents = await this.documents.get('dpns.domain', {});

    const names = documents.filter((el: { data: { label: string; }; }) => el.data.label === id);
    return names[0] || {};
}

export default get;
