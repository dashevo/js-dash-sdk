// @ts-ignore
import Document from "@dashevo/dpp/lib/document/Document";
// @ts-ignore
import DataContract from "@dashevo/dpp/lib/dataContract/DataContract";
// @ts-ignore
import Identity from "@dashevo/dpp/lib/identity/Identity";
import {Record, StateTransitionBuilderTypes} from "./StateTransitionBuilder";

const getTypeOfRecord = (record: Record) => {
    switch (typeof record) {
        case Document.prototype.name:
            return StateTransitionBuilderTypes.DOCUMENT;
        case DataContract.prototype.name:
            return StateTransitionBuilderTypes.CONTRACT;
        case Identity.prototype.name:
            return StateTransitionBuilderTypes.IDENTITY;
        default:
            throw new Error('Invalid record type');
    }
}
export default getTypeOfRecord;
