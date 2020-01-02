const {expect} = require('chai');
const DashJS = require('../../dist/dash.cjs.min.js');
const fixtures = require('../fixtures/user-flow-1');
const Chance = require('chance');
const chance = new Chance();

let sdkInstance;
let hasBalance=false;
let createdIdentityId;
let createdIdentity;

const year = chance.birthday({string: true}).slice(-2);
const firstname = chance.first();
const username = `${firstname}${year}`;

const sdkOpts = {
  network: fixtures.network,
  mnemonic: fixtures.mnemonic
};
describe('Integration - User flow 1 - Identity, DPNS, Documents', function suite() {
  this.timeout(240000);

  it('should init a SDK', async () => {
    sdkInstance = new DashJS.SDK(sdkOpts);
    expect(sdkInstance.network).to.equal('testnet');
    expect(sdkInstance.accountIndex).to.equal(0);
    expect(sdkInstance.apps).to.deep.equal({dpns: {contractId: "2KfMcMxktKimJxAZUeZwYkFUsEcAZhDKEpQs8GMnpUse"}});
    expect(sdkInstance.wallet.network).to.equal('testnet');
    expect(sdkInstance.wallet.offlineMode).to.equal(false);
    expect(sdkInstance.wallet.mnemonic).to.equal(fixtures.mnemonic);
    expect(sdkInstance.wallet.walletId).to.equal('6afaad2189');
    expect(sdkInstance.account.index).to.equal(0);
    expect(sdkInstance.account.walletId).to.equal('6afaad2189');
    expect(sdkInstance.account.getUnusedAddress().address).to.equal('yj8sq7ogzz6JtaxpBQm5Hg9YaB5cKExn5T');

    expect(sdkInstance.platform.dpp).to.exist;
    expect(sdkInstance.platform.client).to.exist;
  });
  it('should swiftly be ready', (done) => {
    let timer = setTimeout(() => {
      done(new Error('Should have been initialized in time'));
    }, 5000);
    sdkInstance.isReady().then(() => {
      clearTimeout(timer);
      expect(sdkInstance.account.state).to.deep.equal({isInitialized: true, isReady: true, isDisconnecting: false});
      expect(sdkInstance.state).to.deep.equal({isReady: true, isAccountReady: true});
      expect(sdkInstance.apps['dpns']).to.exist;
      expect(sdkInstance.apps['dpns'].contractId).to.equal('2KfMcMxktKimJxAZUeZwYkFUsEcAZhDKEpQs8GMnpUse');
      expect(sdkInstance.apps['dpns'].contractId).to.equal('2KfMcMxktKimJxAZUeZwYkFUsEcAZhDKEpQs8GMnpUse');
      return done();
    })
  });
  it('should have a balance', function (done) {
    const balance = (sdkInstance.account.getConfirmedBalance());
    if(balance<10000){
      return done(new Error(`You need to fund this address : ${sdkInstance.account.getUnusedAddress().address}. Insuffisiant balance: ${balance}`));
    }
    hasBalance = true;
    return done();
  });
  it('should register an identity', async function () {
    if(!hasBalance){
      throw new Error('Insufficient balance to perform this test')
    }
    createdIdentityId = await sdkInstance.platform.identities.register();
    expect(createdIdentityId).to.not.equal(null);
    expect(createdIdentityId.length).to.equal(44);
  });

  it('should fetch the identity back', async function () {
    if(!createdIdentityId){
      throw new Error('Can\'t perform the test. Failed to create identity');
    }
    const fetchIdentity = await sdkInstance.platform.identities.get(createdIdentityId);

    expect(fetchIdentity).to.exist;
    expect(fetchIdentity.id).to.equal(createdIdentityId);
    expect(fetchIdentity.type).to.equal(1);
    createdIdentity = fetchIdentity;
  });
  it('should register a name', async function () {
    if(!createdIdentity){
      throw new Error('Can\'t perform the test. Failed to fetch identity');
    }

    const createDocument = await sdkInstance.platform.names.register(username, createdIdentity);
    expect(createDocument.action).to.equal(1);
    expect(createDocument.type).to.equal('domain');
    expect(createDocument.userId).to.equal(createdIdentityId);
    expect(createDocument.contractId).to.equal('2KfMcMxktKimJxAZUeZwYkFUsEcAZhDKEpQs8GMnpUse');
    expect(createDocument.data.label).to.equal(username)
    expect(createDocument.data.normalizedParentDomainName).to.equal('dash');
  });
  it('should wait for block to may be be mined',  function (done) {
    setTimeout(()=>{
      done();
    }, 160000)
  });
  it('should retrieve it\'s identity' , async function () {
    const getDocument = await sdkInstance.platform.names.get(username);
    expect(getDocument.revision).to.equal(1);
    expect(getDocument.type).to.equal('domain');
    expect(getDocument.userId).to.equal(createdIdentityId);
    expect(getDocument.contractId).to.equal('2KfMcMxktKimJxAZUeZwYkFUsEcAZhDKEpQs8GMnpUse');
    expect(getDocument.data.label).to.equal(username)
    expect(getDocument.data.normalizedParentDomainName).to.equal('dash');
  });
  it('should retrieve a document', async function () {
    const doc = await sdkInstance.platform.documents.get('dpns.domain', {where:[
        ["normalizedParentDomainName","==","dash"],
        ["normalizedLabel","==",username.toLowerCase()],
      ]})
    expect(doc.revision).to.equal(1);
    expect(doc.type).to.equal('domain');
    expect(doc.userId).to.equal(createdIdentityId);
    expect(doc.contractId).to.equal('2KfMcMxktKimJxAZUeZwYkFUsEcAZhDKEpQs8GMnpUse');
    expect(doc.data.label).to.equal(username)
    expect(doc.data.normalizedParentDomainName).to.equal('dash');
  });

});

