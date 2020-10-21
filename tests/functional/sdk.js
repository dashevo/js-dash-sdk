const {expect} = require('chai');
const Dash = require(typeof process === 'undefined' ? '../../src/index.ts' : '../../');
const Identifier = require('@dashevo/dpp/lib/Identifier');

const {
  Networks,
} = require('@dashevo/dashcore-lib');

describe('SDK', function suite() {
  this.timeout(700000);

  let account;
  let dpnsContractId;
  let clientOpts;
  let clientInstance;
  let seeds;

  beforeEach(async () => {
    dpnsContractId = Identifier.from(process.env.DPNS_CONTRACT_ID);
    clientOpts = {
      seeds,
      network: process.env.NETWORK,
      wallet: {
        mnemonic: null,
      },
      apps: {
        dpns: {
          contractId: dpnsContractId,
        }
      }
    };
    seeds = process.env.DAPI_SEED.split(',');
    clientInstance = new Dash.Client(clientOpts);
    account = await clientInstance.getWalletAccount();
  });

  it('should init a Client', async () => {
    expect(clientInstance.network).to.equal(process.env.NETWORK);
    expect(clientInstance.walletAccountIndex).to.equal(0);
    expect(clientInstance.apps).to.deep.equal({dpns: {contractId: dpnsContractId.toBuffer()}});
    expect(clientInstance.wallet.network).to.equal(Networks.get(process.env.NETWORK).name);
    expect(clientInstance.wallet.offlineMode).to.equal(false);
    expect(clientInstance.platform.dpp).to.exist;
    expect(clientInstance.platform.client).to.exist;

    expect(account.index).to.equal(0);
  });

  it('should sign and verify a message', async function () {
    const idKey = account.getIdentityHDKeyByIndex(0, 0);
    // This transforms from a Wallet-Lib.PrivateKey to a Dashcore-lib.PrivateKey.
    // It will quickly be annoying to perform this, and we therefore need to find a better solution for that.
    const privateKey = Dash.Core.PrivateKey(idKey.privateKey);
    const message = Dash.Core.Message('hello, world');
    const signed = message.sign(privateKey);
    const verify = message.verify(idKey.privateKey.toAddress().toString(), signed.toString());
    expect(verify).to.equal(true);
  });

  it('should disconnect', async function () {
    await clientInstance.disconnect();
  });
});
