const {expect} = require('chai');
const DashJS = require('../../dist/dash.cjs.min');

describe('DashJS', () => {
  let instanceWithoutWallet;
  let instanceWithWallet;
  it('should provide expected class', function () {
    expect(DashJS).to.have.property('SDK');
    expect(DashJS.SDK.constructor.name).to.be.equal('Function')
  });
  it('should create an instance', function () {
    instanceWithoutWallet = new DashJS.SDK();
    expect(instanceWithoutWallet.network).to.equal('testnet');
    expect(instanceWithoutWallet.apps).to.deep.equal({
          dpns: { contractId: '2KfMcMxktKimJxAZUeZwYkFUsEcAZhDKEpQs8GMnpUse' }
        }
    );

    instanceWithWallet = new DashJS.SDK({mnemonic:null});
    expect(instanceWithWallet.network).to.equal('testnet');
    expect(instanceWithWallet.apps).to.deep.equal({
          dpns: { contractId: '2KfMcMxktKimJxAZUeZwYkFUsEcAZhDKEpQs8GMnpUse' }
        }
    );
    expect(instanceWithWallet.wallet.mnemonic).to.exist;
  });
  it('should sign and verify a message', function () {
    const {account} = instanceWithWallet;
    const idKey = instanceWithWallet.account.getIdentityHDKey();
    const message = new DashJS.Message('hello, world');
    const signed = account.sign(message, idKey.privateKey);
    const verify = message.verify(idKey.privateKey.toAddress().toString(), signed.toString());
    expect(verify).to.equal(true);
  });
  after(()=>{
    instanceWithWallet.wallet.disconnect();
    instanceWithoutWallet.disconnect();
  })
});
