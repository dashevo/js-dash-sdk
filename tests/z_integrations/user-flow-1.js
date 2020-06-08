const {expect} = require('chai');
const Dash = require('../../dist/dash.cjs.min.js');
const fixtures = require('../fixtures/user-flow-1');
const Chance = require('chance');
const chance = new Chance();
const DataContract = require('@dashevo/dpp/lib/dataContract/DataContract');

let clientInstance;
let hasBalance=false;
let hasDuplicate=true;
let createdIdentityId;
let createdIdentity;

const year = chance.birthday({string: true}).slice(-2);
const firstname = chance.first();
const username = `test-${firstname}${year}`;

const dpnsContractId = 'E56D2XC5oh5bw9o8n4Vtk9QRZczSWXweMNzbphtKSfzk';

const clientOpts = {
  network: fixtures.network,
  wallet: {
    mnemonic: fixtures.mnemonic,
    transporter: {
      type: 'DAPIClient',
      seeds: [{service: '54.188.88.39'}]
    }
  },
  seeds: [{service: '54.188.88.39:3000'}],
  apps: {
    dpns: {
      contractId: dpnsContractId
    }
  }
};

let account;
describe('Integration - User flow 1 - Identity, DPNS, Documents', function suite() {
  this.timeout(240000);

  it('should init a Client', async () => {
    clientInstance = new Dash.Client(clientOpts);
    expect(clientInstance.network).to.equal('testnet');
    expect(clientInstance.walletAccountIndex).to.equal(0);
    expect(clientInstance.apps).to.deep.equal({dpns: {contractId: dpnsContractId}});
    expect(clientInstance.wallet.network).to.equal('testnet');
    expect(clientInstance.wallet.offlineMode).to.equal(false);
    expect(clientInstance.wallet.mnemonic).to.equal(fixtures.mnemonic);
    expect(clientInstance.wallet.walletId).to.equal('ad7982c7fe');

    account = await clientInstance.getWalletAccount();

    expect(account.index).to.equal(0);
    expect(account.walletId).to.equal('ad7982c7fe');
    expect(account.getUnusedAddress().address).to.be.not.equal('yZtkbuQhTPGbyD4En81Qyio4Np4BhQVh8M');
    expect(account.state).to.deep.equal({isInitialized: true, isReady: true, isDisconnecting: false});
    expect(clientInstance.platform.dpp).to.exist;
    expect(clientInstance.platform.client).to.exist;
  });
  it('should have a balance', function (done) {
    const balance = (account.getTotalBalance());
    if(balance<10000){
      return done(new Error(`You need to fund this address : ${account.getUnusedAddress().address}. Insuffisiant balance: ${balance}`));
    }
    hasBalance = true;
    return done();
  });
  it('should check if name is available' , async function () {
    const getDocument = await clientInstance.platform.names.get(username);
    expect(getDocument).to.equal(null);
    hasDuplicate = false;
  });
  it('should register an identity', async function () {
    if(!hasBalance){
      throw new Error('Insufficient balance to perform this test')
    }

    try {
      createdIdentity = await clientInstance.platform.identities.register();
    } catch (e) {
      console.dir(e, {depth: 10})
    }

    createdIdentityId = createdIdentity.getId();

    console.log(createdIdentityId);

    expect(createdIdentityId).to.not.equal(null);
    expect(createdIdentityId.length).to.gte(42);
    expect(createdIdentityId.length).to.lte(44);
  });

  it('should fetch the identity back', async function () {
    if(!createdIdentityId){
      throw new Error('Can\'t perform the test. Failed to create identity');
    }

    const fetchIdentity = await clientInstance.platform.identities.get(createdIdentityId);

    expect(fetchIdentity).to.exist;
    expect(fetchIdentity.getId()).to.equal(createdIdentityId);

    createdIdentity = fetchIdentity;
  });
  it('should register a name', async function () {
    if(!createdIdentity){
      throw new Error('Can\'t perform the test. Failed to fetch identity');
    }
    if(hasDuplicate){
      throw new Error(`Duplicate username ${username} registered. Skipping.`)
    }

    const createDocument = await clientInstance.platform.names.register(username, createdIdentity);
    expect(createDocument.getType()).to.equal('domain');
    expect(createDocument.getOwnerId()).to.equal(createdIdentityId);
    expect(createDocument.getDataContractId()).to.equal(dpnsContractId);
    expect(createDocument.get('label')).to.equal(username);
    expect(createDocument.get('normalizedParentDomainName')).to.equal('dash');
  });

  it('should retrieve itself by document', async function () {
    if(!createdIdentity){
      throw new Error('Can\'t perform the test. Failed to fetch identity & did not reg name');
    }

    const [doc] = await clientInstance.platform.documents.get('dpns.domain', {where:[
        ["normalizedParentDomainName","==","dash"],
        ["normalizedLabel","==",username.toLowerCase()],
      ]});

    expect(doc).to.exist;
    expect(doc.getRevision()).to.equal(1);
    expect(doc.getType()).to.equal('domain');
    expect(doc.getOwnerId()).to.equal(createdIdentityId);
    expect(doc.getDataContractId()).to.equal(dpnsContractId);
    expect(doc.get('label')).to.equal(username);
    expect(doc.get('normalizedParentDomainName')).to.equal('dash');
  });
  it('should create and broadcast contract', async () => {
    if(!createdIdentity){
      throw new Error('Can\'t perform the test. Failed to fetch identity & did not reg name');
    }

    const documentsDefinition = {
      test: {
        properties: {
          testProperty: {
            type: "string"
          }
        },
        additionalProperties: false,
      }
    }

    const contract = await clientInstance.platform.contracts.create(documentsDefinition, createdIdentity);

    expect(contract).to.exist;
    expect(contract).to.be.instanceOf(DataContract);

    await clientInstance.platform.contracts.broadcast(contract, createdIdentity);

    const fetchedContract = await clientInstance.platform.contracts.get(contract.getId());

    expect(fetchedContract).to.exist;
    expect(fetchedContract).to.be.instanceOf(DataContract);
    expect(fetchedContract.toJSON()).to.be.deep.equal(contract.toJSON());
  });
  it('should top up identity', async function () {
    const identityId = createdIdentity.getId();

    const identityBeforeTopUp = await clientInstance.platform.identities.get(identityId);
    const balanceBeforeTopUp = identityBeforeTopUp.getBalance();
    const topUpAmount = 10000;
    const topUpCredits = topUpAmount * 1000;
    const topUpFee = 146;

    try {
      await clientInstance.platform.identities.topUp(identityId, topUpAmount);
    } catch (e) {
      console.dir(e, {depth: 100});
    }

    const identity = await clientInstance.platform.identities.get(identityId);

    expect(identity.getId()).to.be.equal(identityId);
    expect(identity.getBalance()).to.be.equal(balanceBeforeTopUp + topUpCredits - topUpFee);
    expect(identity.getBalance()).to.be.greaterThan(10000);
  })
  it('should disconnect', async function () {
    await clientInstance.disconnect();
  });
});

