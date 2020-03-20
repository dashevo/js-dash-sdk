const {expect} = require('chai');
const DashJS = require('../../dist/dash.cjs.min');

describe('SDK', () => {
  let instanceWithoutWallet;
  let instanceWithWallet;
  it('should provide expected class', function () {
    expect(DashJS).to.have.property('Client');
    expect(DashJS.Client.constructor.name).to.be.equal('Function')
  });
  it('should create an instance', function (done) {
    instanceWithoutWallet = new DashJS.Client();
    expect(instanceWithoutWallet.network).to.equal('testnet');
    expect(instanceWithoutWallet.apps).to.deep.equal({
          dpns: { contractId: '77w8Xqn25HwJhjodrHW133aXhjuTsTv9ozQaYpSHACE3' }
        }
    );

    instanceWithWallet = new DashJS.Client({mnemonic:null});
    expect(instanceWithWallet.network).to.equal('testnet');
    expect(instanceWithWallet.apps).to.deep.equal({
          dpns: { contractId: '77w8Xqn25HwJhjodrHW133aXhjuTsTv9ozQaYpSHACE3' }
        }
    );
    expect(instanceWithWallet.wallet.mnemonic).to.exist;
    done();
  });
  it('should sign and verify a message', function () {
    const {account} = instanceWithWallet;
    const idKey = instanceWithWallet.account.getIdentityHDKey();
    // This transforms from a Wallet-Lib.PrivateKey to a Dashcore-lib.PrivateKey.
    // It will quickly be annoying to perform this, and we therefore need to find a better solution for that.
    const privateKey = DashJS.Core.PrivateKey(idKey.privateKey);
    const message = DashJS.Core.Message('hello, world');
    const signed = message.sign(privateKey);
    const verify = message.verify(idKey.privateKey.toAddress().toString(), signed.toString());
    expect(verify).to.equal(true);
  });
  after(()=>{
    instanceWithWallet.wallet.disconnect();
    instanceWithoutWallet.disconnect();
  })
});
