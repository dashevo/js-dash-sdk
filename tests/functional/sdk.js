const {expect} = require('chai');
const Dash = require(typeof process === 'undefined' ? '../../src/index.ts' : '../../');

const {
  Transaction,
  PrivateKey,
  Networks,
} = require('@dashevo/dashcore-lib');

const isRegtest = process.env.NETWORK === 'regtest' || process.env.NETWORK === 'local';

function wait(ms) {
  return new Promise((res) => setTimeout(res, ms));
}

/**
 *
 * @param {Account} walletAccount
 * @return {Promise<void>}
 */
async function waitForBalanceToChange(walletAccount) {
  const originalBalance = walletAccount.getTotalBalance();

  let currentIteration = 0;
  while (walletAccount.getTotalBalance() === originalBalance
  && currentIteration <= 40) {
    await wait(500);
    currentIteration++;
  }
}

/**
 *
 * @param {DAPIClient} dapiClient
 * @param {Address} faucetAddress
 * @param {PrivateKey} faucetPrivateKey
 * @param {Address} address
 * @param {number} amount
 * @return {Promise<string>}
 */
async function fundAddress(dapiClient, faucetAddress, faucetPrivateKey, address, amount) {
  let { items: inputs } = await dapiClient.core.getUTXO(faucetAddress);

  if (isRegtest) {
    const { blocks } = await dapiClient.core.getStatus();

    inputs = inputs.filter((input) => input.height < blocks - 100);
  }
  // We take random coz two browsers run in parallel
  // and they can take the same inputs

  const inputIndex = Math.floor(
    Math.random() * Math.floor(inputs.length / 2) * -1,
  );

  const transaction = new Transaction();

  transaction.from(inputs.slice(inputIndex)[0])
    .to(address, amount)
    .change(faucetAddress)
    .fee(668)
    .sign(faucetPrivateKey);

  let { blocks: currentBlockHeight } = await dapiClient.core.getStatus();

  const transactionId = await dapiClient.core.broadcastTransaction(transaction.toBuffer());

  const desiredBlockHeight = currentBlockHeight + 1;

  if (isRegtest) {
    const privateKey = new PrivateKey();

    await dapiClient.core.generateToAddress(
        1,
        privateKey.toAddress(process.env.NETWORK).toString(),
    );
  } else {
    do {
      ({ blocks: currentBlockHeight } = await dapiClient.core.getStatus());
      await wait(30000);
    } while (currentBlockHeight < desiredBlockHeight);
  }

  return transactionId;
}


let clientInstance;
let hasBalance=false;

const seeds = process.env.DAPI_SEED
  .split(',');

const clientOpts = {
  seeds,
  network: process.env.NETWORK,
  wallet: {
    mnemonic: null,
  },
  apps: {
    dpns: {
      contractId: process.env.DPNS_CONTRACT_ID,
    }
  }
};

let account;

describe('SDK', function suite() {
  this.timeout(700000);

  it('should init a Client', async () => {
    clientInstance = new Dash.Client(clientOpts);
    expect(clientInstance.network).to.equal(process.env.NETWORK);
    expect(clientInstance.walletAccountIndex).to.equal(0);
    expect(clientInstance.apps).to.deep.equal({dpns: {contractId: process.env.DPNS_CONTRACT_ID}});
    expect(clientInstance.wallet.network).to.equal(Networks.get(process.env.NETWORK).name);
    expect(clientInstance.wallet.offlineMode).to.equal(false);
    expect(clientInstance.platform.dpp).to.exist;
    expect(clientInstance.platform.client).to.exist;

    account = await clientInstance.getWalletAccount();
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

  it('should populate balance with dash', async () => {
    const faucetPrivateKey = PrivateKey.fromString(process.env.FAUCET_PRIVATE_KEY);
    const faucetAddress = faucetPrivateKey
      .toAddress(process.env.NETWORK)
      .toString();

    await fundAddress(
      clientInstance.getDAPIClient(),
      faucetAddress,
      faucetPrivateKey,
      account.getAddress().address,
      100000
    );

    if (isRegtest) {
      await waitForBalanceToChange(account);
    }
  })

  it('should have a balance', function (done) {
    const balance = (account.getTotalBalance());
    if(balance<10000){
      return done(new Error(`You need to fund this address : ${account.getUnusedAddress().address}. Insuffisiant balance: ${balance}`));
    }
    hasBalance = true;
    return done();
  });

  it('should disconnect', async function () {
    await clientInstance.disconnect();
  });
});
