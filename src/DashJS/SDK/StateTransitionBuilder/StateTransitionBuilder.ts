// @ts-ignore
import DAPIClient from "@dashevo/dapi-client";

import {PrivateKey} from "@dashevo/dashcore-lib";
// @ts-ignore
import Document from "@dashevo/dpp/lib/document/Document";
// @ts-ignore
import DataContract from "@dashevo/dpp/lib/dataContract/DataContract";
// @ts-ignore
import Identity from "@dashevo/dpp/lib/identity/Identity";
// @ts-ignore
import DashPlatformProtocol from "@dashevo/dpp";

export const enum StateTransitionBuilderTypes {
    CONTRACT = 'dataContract',
    DOCUMENT = 'document',
    IDENTITY = 'identity',
}

export type Record = Document | DataContract | Identity;

export interface StateTransitionBuilderOpts {
    type: StateTransitionBuilderTypes,
    dpp: DashPlatformProtocol,
    client?: DAPIClient
};

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

/**
 * Builder for ST. Allows to manage and broadcast a set of record
 *
 * @param {StateTransitionBuilderTypes} type - a valid st builder type
 * @param dpp - DashPlatformProtocol instance
 * @param client - DAPIClient instance
 */
export class StateTransitionBuilder {
    public records: Record[];
    public type: StateTransitionBuilderTypes;

    private dpp: DashPlatformProtocol | undefined;
    private client: DAPIClient | undefined;

    constructor(opts: StateTransitionBuilderOpts) {
        this.type = opts.type || StateTransitionBuilderTypes.DOCUMENT;

        if (opts.client) this.client = opts.client;
        if (opts.dpp === undefined) {
            throw new Error('Records requires a DPP instance for stateTransition creation');
        }
        this.dpp = opts.dpp;
        this.records = [];
    }

    /**
     * Allow to add a new record
     * @param record - a valid record
     */
    addRecord(record: Record) {
        let recordType = getTypeOfRecord(record);
        if (recordType !== this.type) {
            throw new Error(`Records cannot add to records of type ${this.type}: record type ${recordType}`);
        }
        this.records.push(record);
    }

    /**
     * Register the records to the platform by broadcasting a state transition.
     *
     * @param {Identity} identity - identity with which broadcast theses records
     * @param {PrivateKey} identityPrivateKey - private key associate to the identity for ST signing.
     */
    async register(identity: Identity, identityPrivateKey: PrivateKey) {
        const dapiClient = this.client;
        if (!dapiClient) {
            throw new Error('Requires a DAPIClient instance for stateTransition creation');
        }
        let stateTransition = this.toStateTransition();

        stateTransition.sign(identity.getPublicKeyById(1), identityPrivateKey);

        // @ts-ignore
        await dapiClient.applyStateTransition(stateTransition);

    }

    /**
     * Returns a StateTransition containing the records
     * @return {DataContractStateTransition|DocumentsStateTransition|IdentityCreateTransition}
     */
    toStateTransition() {
        return this.dpp[this.type].createStateTransition(this.records)
    }
}

export default StateTransitionBuilder;
