import {Platform} from "../../Platform";

const entropy = require('@dashevo/dpp/lib/util/entropy');
const { hash } = require('@dashevo/dpp/lib/util/multihashDoubleSHA256');
const bs58 = require('bs58');

/**
 * Register names to the platform
 *
 * @param {Platform} this - bound instance class
 * @param {string} name - name
 * @param identity - identity
 * @param {any} [identity.id] - identity ID
 * @param {function(number):any} - get public key by ID
 * @param {Object} records - records object having only one of the following items
 * @param {string} [records.dashUniqueIdentityId]
 * @param {string} [records.dashAliasIdentityId]
 * @returns registered names
 */
export async function register(this: Platform,
                               name: string,
                               identity: {
                                   getId(): string;
                                   getPublicKeyById(number: number):any;
                               },
                               records: {
                                   dashUniqueIdentityId?: string,
                                   dashAliasIdentityId?: string,
                               },
): Promise<any> {
    const nameLabels = name.split('.');

    const normalizedParentDomainName = nameLabels
        .slice(1)
        .join('.')
        .toLowerCase();

    const [label] = nameLabels;
    const normalizedLabel = label.toLowerCase();

    const preorderSalt = bs58.decode(entropy.generate());

    const fullDomainName = normalizedParentDomainName.length > 0
        ? `${normalizedLabel}.${normalizedParentDomainName}`
        : normalizedLabel;

    const nameHash = hash(
        Buffer.from(fullDomainName),
    );

    const saltedDomainHash = Buffer.concat([
        preorderSalt,
        nameHash,
    ]);

    if (!this.apps.dpns.contractId) {
        throw new Error('DPNS is required to register a new name.');
    }

    // 1. Create preorder document
    const preorderDocument = await this.documents.create(
        'dpns.preorder',
        identity,
        {
            saltedDomainHash,
        },
    );

    await this.documents.broadcast(
        {
            create: [preorderDocument],
        },
        identity,
    );

    // 3. Create domain document
    const domainDocument = await this.documents.create(
        'dpns.domain',
        identity,
        {
            label,
            normalizedLabel,
            normalizedParentDomainName,
            preorderSalt,
            records,
            subdomainRules: {
                allowSubdomains: false,
            },
        },
    );

    // 4. Create and send domain state transition
    await this.documents.broadcast(
        {
            create: [domainDocument],
        },
        identity,
    );

    return domainDocument;
}

export default register;
