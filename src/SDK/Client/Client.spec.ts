import { expect } from 'chai';
import { Client } from "./index";
import 'mocha';
import { Transaction } from "@dashevo/dashcore-lib";
import { createFakeInstantLock } from "../../utils/createFakeIntantLock";

// @ts-ignore
const TxStreamMock = require('@dashevo/wallet-lib/src/test/mocks/TxStreamMock');
// @ts-ignore
const TransportMock = require('@dashevo/wallet-lib/src/test/mocks/TransportMock');
// @ts-ignore
const TxStreamDataResponseMock = require('@dashevo/wallet-lib/src/test/mocks/TxStreamDataResponseMock');

const mnemonic = 'agree country attract master mimic ball load beauty join gentle turtle hover';
describe('Dash - Client', function suite() {
  let txStreamMock;
  let transportMock;
  let testHDKey;
  let clientWithMockTransport;
  let account;
  let walletTransaction;

  beforeEach(async function beforeEach() {
    txStreamMock = new TxStreamMock();
    transportMock = new TransportMock(this.sinon, txStreamMock);
    testHDKey = "xprv9s21ZrQH143K4PgfRZPuYjYUWRZkGfEPuWTEUESMoEZLC274ntC4G49qxgZJEPgmujsmY52eVggtwZgJPrWTMXmbYgqDVySWg46XzbGXrSZ";

    transportMock.getIdentityIdsByPublicKeyHash.returns([null]);

    clientWithMockTransport = new Client({
      wallet: {
        HDPrivateKey: testHDKey,
      }
    });
    // @ts-ignore
    clientWithMockTransport.wallet.transport = transportMock;

    // setInterval(() => {
    //   txStreamMock.emit(TxStreamMock.EVENTS.end);
    // }, 100);

    [account] = await Promise.all([
      clientWithMockTransport.wallet.getAccount(),
      new Promise(resolve => {
        setTimeout(() => {
          txStreamMock.emit(TxStreamMock.EVENTS.end);
          resolve();
        }, 100)
      })
    ]);
    // account = await clientWithMockTransport.wallet.getAccount();

    // add fake tx to the wallet so it will be able to create transactions
    walletTransaction = new Transaction(undefined)
        .from([{
          amount: 150000,
          script: '76a914f9996443a7d5e2694560f8715e5e8fe602133c6088ac',
          outputIndex: 0,
          txid: new Transaction(undefined).hash,
        }])
        .to(account.getAddress(10).address, 100000);

    await account.importTransactions([walletTransaction.serialize(true)]);
  });

  this.timeout(10000);
  it('should provide expected class', function () {
    expect(Client.name).to.be.equal('Client');
    expect(Client.constructor.name).to.be.equal('Function');
  });
  it('should be instantiable', function () {
    const client = new Client();
    expect(client).to.exist;
    expect(client.network).to.be.equal('evonet');
    expect(client.getDAPIClient().constructor.name).to.be.equal('DAPIClient');
  });
  it('should not initiate wallet lib without mnemonic', function () {
    const client = new Client();
    expect(client.wallet).to.be.equal(undefined);
  });
  it('should initiate wallet-lib with a mnemonic', async ()=>{
    const client = new Client({
      wallet: {
        mnemonic,
        offlineMode: true,
      }
    });
    expect(client.wallet).to.exist;
    expect(client.wallet!.offlineMode).to.be.equal(true);

    await client.wallet?.storage.stopWorker();
    await client.wallet?.disconnect();

    const account = await client.getWalletAccount();
    await account.disconnect();
  });
  it('should throw an error if client and wallet have different networks', async () => {
    try {
      new Client({
        network: 'evonet',
        wallet: {
          mnemonic,
          offlineMode: true,
          network: 'testnet',
        },
      });

      expect.fail('should throw an error');
    } catch (e) {
      expect(e.message).to.equal('Wallet and Client networks are different');
    }
  });

  describe('#platform.identities.register', async () => {
    it('should register an identity', async () => {
      const isLock = createFakeInstantLock(walletTransaction.hash);
      txStreamMock.emit(
          TxStreamMock.EVENTS.data,
          new TxStreamDataResponseMock(
              { instantSendLockMessages: [isLock.toBuffer()] }
          )
      );

      transportMock.sendTransaction.callsFake((txString) => {
        const registrationTx = new Transaction(txString);

        const isLock = createFakeInstantLock(registrationTx.hash);
        txStreamMock.emit(
            TxStreamMock.EVENTS.data,
            new TxStreamDataResponseMock(
                { instantSendLockMessages: [isLock.toBuffer()] }
            )
        );
      });

      const [identity] = await Promise.all([
        clientWithMockTransport.platform.identities.register(),
      ]);

      expect(identity).to.be.not.null;
    });
  });
});
