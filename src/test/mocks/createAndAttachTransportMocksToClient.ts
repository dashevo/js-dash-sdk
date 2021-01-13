import { Transaction } from "@dashevo/dashcore-lib";
import stateTransitionTypes from "@dashevo/dpp/lib/stateTransition/stateTransitionTypes";
import Identity from "@dashevo/dpp/lib/identity/Identity";

import { createFakeInstantLock } from "../../utils/createFakeIntantLock";
import { createDapiClientMock } from "./createDapiClientMock";

// @ts-ignore
const TxStreamMock = require('@dashevo/wallet-lib/src/test/mocks/TxStreamMock');
// @ts-ignore
const TxStreamDataResponseMock = require('@dashevo/wallet-lib/src/test/mocks/TxStreamDataResponseMock');
// @ts-ignore
const TransportMock = require('@dashevo/wallet-lib/src/test/mocks/TransportMock');

function makeTxStreamEmitISLocksForTransactions(transportMock, txStreamMock) {
    transportMock.sendTransaction.callsFake((txString) => {
        const transaction = new Transaction(txString);
        const isLock = createFakeInstantLock(transaction.hash);

        txStreamMock.emit(
            TxStreamMock.EVENTS.data,
            new TxStreamDataResponseMock(
                { instantSendLockMessages: [isLock.toBuffer()] }
            )
        );

        // Emit the same transaction back to the client so it will know about the change transaction
        txStreamMock.emit(
            TxStreamMock.EVENTS.data,
            new TxStreamDataResponseMock(
                { rawTransactions: [transaction.toBuffer()] }
            )
        );
    });
}

function makeGetIdentityRespondWithIdentity(client, dapiClientMock) {
    dapiClientMock.platform.broadcastStateTransition.callsFake(async (stBuffer) => {
        let interceptedIdentityStateTransition = await client.platform.dpp.stateTransition.createFromBuffer(stBuffer);

        if (interceptedIdentityStateTransition.getType() === stateTransitionTypes.IDENTITY_CREATE) {
            let identityToResolve = new Identity({
                protocolVersion: interceptedIdentityStateTransition.getProtocolVersion(),
                id: interceptedIdentityStateTransition.getIdentityId().toBuffer(),
                publicKeys: interceptedIdentityStateTransition.getPublicKeys().map((key) => key.toObject()),
                balance: interceptedIdentityStateTransition.getAssetLock().getOutput().satoshis,
                revision: 0,
            });
            dapiClientMock.platform.getIdentity.withArgs(identityToResolve.getId()).resolves(identityToResolve.toBuffer());
        }
    });
}

export async function createAndAttachTransportMocksToClient(client, sinon) {
    const txStreamMock = new TxStreamMock();
    const transportMock = new TransportMock(sinon, txStreamMock);
    const dapiClientMock = createDapiClientMock(sinon);

    // Mock wallet-lib transport to intercept transactions
    client.wallet.transport = transportMock;
    // Mock dapi client for platform endpoints
    client.dapiClient = dapiClientMock;

    // Emitting txStream.end, so client will resolve sync process
    await Promise.all([
        client.wallet.getAccount(),
        new Promise(resolve => {
            setTimeout(() => {
                txStreamMock.emit(TxStreamMock.EVENTS.end);
                resolve();
            }, 10)
        })
    ]);

    // Putting data in transport stubs
    transportMock.getIdentityIdsByPublicKeyHash.resolves([null]);
    makeTxStreamEmitISLocksForTransactions(transportMock, txStreamMock);
    makeGetIdentityRespondWithIdentity(client, dapiClientMock);

    return { txStreamMock, transportMock, dapiClientMock };
}