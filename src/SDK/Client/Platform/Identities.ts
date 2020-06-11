import {Platform} from "./Platform";
import {PrivateKey, PublicKey, Opcode, crypto, Transaction} from "@dashevo/dashcore-lib";
import bs58 from 'bs58';
import {utils} from "@dashevo/wallet-lib";
import Client from "../Client";
import EventEmitter from "events";

const SYNCHRONIZED = "SYNCHRONIZED";

export class Identities {
    private readonly platform: Platform;
    private readonly network: string;
    private readonly client: Client;
    private ownIdentities: {[key: string]: any} = {};
    private isSynchronized: boolean;
    private isSyncing: boolean;
    private events: EventEmitter;

    static createOutPointBuffer(txHash, outputIndex) {
        const binaryTransactionHash = Buffer.from(txHash, 'hex');
        const indexBuffer = Buffer.alloc(4);

        indexBuffer.writeUInt32LE(outputIndex, 0);

        return Buffer.concat([binaryTransactionHash, indexBuffer]);
    }

    constructor(platform: Platform) {
        this.platform = platform;
        // @ts-ignore TODO: fix platform options
        this.account = platform.client.account;
        this.client = platform.client;
        this.network = this.platform.network || 'testnet';
        this.isSynchronized = false;
        this.isSyncing = false;
        this.events = new EventEmitter();
    }

    /**
     * If identities are synchronized resolves immediately, otherwise resolves after they are synced.
     */
    private async waitForSynchronization(): Promise<void> {
        if (this.isSynchronized) {
            return Promise.resolve();
        }
        return new Promise((resolve => {
            this.events.on(SYNCHRONIZED, resolve);
        }));
    }

    /**
     * Creates asset lock transaction and returns the private key that can be used to sign identity state transition
     * @return {Promise<{ assetLockTransaction: Transaction, assetLockPrivateKey: PrivateKey }>}
     */
    private async createFundingTransaction(): Promise<{ assetLockTransaction: Transaction, assetLockPrivateKey: PrivateKey }> {
        const burnAmount = 10000;
        const account = await this.client.getWalletAccount();

        const identityAddressInfo = account.getUnusedAddress();
        const [identityHDPrivateKey] = account.getPrivateKeys([identityAddressInfo.address]);
        // @ts-ignore
        const assetLockPrivateKey = identityHDPrivateKey.privateKey;
        const assetLockPublicKey = assetLockPrivateKey.toPublicKey();

        const identityAddress = assetLockPublicKey.toAddress(this.network).toString();
        const changeAddress = account.getUnusedAddress('internal').address;

        const lockTransaction = new Transaction(undefined);

        const output = {
            satoshis: burnAmount,
            address: identityAddress
        };

        const utxos = account.getUTXOS();
        const balance = account.getTotalBalance();

        if (balance < output.satoshis) {
            throw new Error(`Not enough balance (${balance}) to cover burn amount of ${burnAmount}`);
        }

        const selection = utils.coinSelection(utxos, [output]);

        // FIXME : Usage with a single utxo had estimated fee of 205.
        // But network failed us with 66: min relay fee not met.
        // Over-writing the value for now.
        selection.estimatedFee = 680;

        lockTransaction
            .from(selection.utxos)
            // @ts-ignore
            .to(identityAddressInfo.address, 10000)
            // @ts-ignore
            .addBurnOutput(output.satoshis, assetLockPublicKey._getID())
            // @ts-ignore
            .change(changeAddress)
            .fee(selection.estimatedFee);

        const UTXOHDPrivateKey = account.getPrivateKeys(selection.utxos.map((utxo: any) => utxo.address.toString()));

        // @ts-ignore
        const signingKeys = UTXOHDPrivateKey.map((hdprivateKey) => hdprivateKey.privateKey);
        const assetLockTransaction = lockTransaction.sign(signingKeys);

        return { assetLockTransaction, assetLockPrivateKey: assetLockPrivateKey };
    }

    upsertIdentityToStorage(identity: any) {
        this.ownIdentities[identity.getId()] = identity;
    }

    async listIdentities(): Promise<{ [key: string]: any }> {
        await this.synchronizeIdentities();
        return this.ownIdentities;
    }

    /**
     * @param {IdentityPublicKey} identityPublicKey
     * @return {PrivateKey}
     */
    async getPrivateKeyByIdentityPublicKey(identityPublicKey: any): Promise<PrivateKey> {
        const account = await this.client.getWalletAccount();

        const identityPublicKeyHex = Buffer
            .from(identityPublicKey.getData(), 'base64')
            .toString('hex');
        const publicKey = new PublicKey(identityPublicKeyHex, { network: this.platform.network });
        const address = publicKey.toAddress(this.network).toString();
        const [privateKey] = account
            .getPrivateKeys([address])
            // @ts-ignore TODO: Fix typing in the wallet-lib
            .map(HDKey => HDKey.privateKey);
        return privateKey;
    }

    /**
     * Synchronizes identities if they aren't in sync, or resolves immediately if they are.
     * Only one synchronization runs at one time, if called twice, just waits for the first one to be finished.
     * @return Promise<void>
     */
    async synchronizeIdentities(): Promise<void> {
        if (this.isSyncing) {
            await this.waitForSynchronization();
            return;
        }

        this.isSyncing = true;

        const account = await this.client.getWalletAccount();
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
                return this.get(id)
            }));

        identities.forEach((identity: any) => {
           this.ownIdentities[identity.getId()] = identity;
        });

        this.isSyncing = false;
        this.isSynchronized = true;
        this.events.emit(SYNCHRONIZED);
    }

    /**
     * Get an identity by its id
     * @param {string} identityId
     * @return {Promise<Identity>}
     */
    async get(identityId: string): Promise<any> {
        // @ts-ignore
        const identityBuffer = await this.client.getDAPIClient().getIdentity(identityId);

        if (identityBuffer === null) {
            return null;
        }

        return this.platform.dpp.identity.createFromSerialized(identityBuffer);
    }

    /**
     * Registeres new identity
     * @return {Promise<Identity>}
     */
    async register(): Promise<any> {
        await this.synchronizeIdentities();

        const account = await this.client.getWalletAccount();

        const { assetLockTransaction, assetLockPrivateKey } = await this.createFundingTransaction();
        // TODO: this should be a separate key from the asset lock key, but there's no specification
        // for the identity keys derivation path as of date of writing (2020.06.10)
        const identityPublicKey = assetLockPrivateKey.toPublicKey();

        const outPoint = assetLockTransaction.getOutPointBuffer(0).toString('base64');

        const identity = this.platform.dpp.identity.create(outPoint, [identityPublicKey]);
        const identityCreateTransition = this.platform.dpp.identity.createIdentityCreateTransition(identity);

        await account.broadcastTransaction(assetLockTransaction.serialize(false));

        identityCreateTransition.signByPrivateKey(assetLockPrivateKey);

        const result = await this.platform.dpp.stateTransition.validateStructure(identityCreateTransition);

        if (!result.isValid()) {
            throw new Error(`StateTransition is invalid - ${JSON.stringify(result.getErrors())}`);
        }

        await this.platform.client.getDAPIClient().applyStateTransition(identityCreateTransition);

        this.upsertIdentityToStorage(identity);
        // @ts-ignore
        return identity;
    }
}