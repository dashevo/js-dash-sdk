import {Platform} from "./Platform";
import {PrivateKey, PublicKey, Opcode, crypto} from "@dashevo/dashcore-lib";
import {Account} from "@dashevo/wallet-lib/src";
import bs58 from 'bs58';

export class Identities {
    private readonly platform: Platform;
    private readonly account: Account;
    private ownIdentities: {[key: string]: any} = {};

    static createOutPointBuffer(txHash, outputIndex) {
        const binaryTransactionHash = Buffer.from(txHash, 'hex');
        const indexBuffer = Buffer.alloc(4);

        indexBuffer.writeUInt32LE(outputIndex, 0);

        return Buffer.concat([binaryTransactionHash, indexBuffer]);
    }

    constructor(platform: Platform, account: Account) {
        this.platform = platform;
        this.account = account;
    }

    async init() {
        await this.synchronizeIdentities();
    }

    updateIdentity(identity: any) {
        this.ownIdentities[identity.getId()] = identity;
    }

    getIdentity(identityId: string): any{
        return this.ownIdentities[identityId];
    }

    getIdentities(): any {
        return this.ownIdentities;
    }

    /**
     * @param {IdentityPublicKey} identityPublicKey
     * @return {PrivateKey}
     */
    getPrivateKeyByIdentityPublicKey(identityPublicKey: any): PrivateKey {
        const identityPublicKeyHex = Buffer
            .from(identityPublicKey.getData(), 'base64')
            .toString('hex');
        const publicKey = new PublicKey(identityPublicKeyHex, { network: this.platform.network });
        const address = publicKey.toAddress(this.platform.network || 'testnet').toString();
        const [privateKey] = this.account
            .getPrivateKeys([address])
            // @ts-ignore TODO: Fix typing in the wallet-lib
            .map(HDKey => HDKey.privateKey);
        return privateKey;
    }

    async synchronizeIdentities() {
        const account = this.account;
        const transactionsMap = await account.getTransactions();

        const transactions = Object.keys(transactionsMap).map((txid) => {
            return transactionsMap[txid];
        });

        const outputs = transactions.reduce((outputs, transaction) => {
            const preparedOutputs = transaction.outputs.map((output, index) => {
                let isBurnOutput;
                const outPointBuffer = Identities.createOutPointBuffer(transaction.hash, index);
                const outputHasTwoChunks = output.script.chunks.length === 2;

                if (outputHasTwoChunks) {
                    const isFirstOpcodeOP_RETURN = output.script.chunks[0].opcodenum === Opcode.map["OP_RETURN"];
                    const isSecondOpcodePubKey = output.script.chunks[1].len === 20;
                    isBurnOutput = isFirstOpcodeOP_RETURN && isSecondOpcodePubKey;
                }

                return {
                    outPointBuffer,
                    isBurnOutput: isBurnOutput
                };
            });
            return outputs.concat(preparedOutputs);
        }, []);

        const burnOutputs = outputs.filter((output) => output.isBurnOutput);
        const identityIds = burnOutputs.map(burnOutput => {
            return bs58.encode(
                crypto.Hash.sha256sha256(burnOutput.outPointBuffer)
            );
        });

        const identities = await Promise
            .all(identityIds.map(id => {
                return this.platform.identities.get(id)
            }));

        identities.forEach(identity => {
            // @ts-ignore
           this.ownIdentities[identity.getId()] = identity;
        });
    }
}