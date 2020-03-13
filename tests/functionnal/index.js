const {expect} = require('chai');
const DashJS = require('../../dist/dash.cjs.min');

describe('SDK', () => {
  let instanceWithoutWallet;
  let instanceWithWallet;
  it('should provide expected class', function () {
    expect(DashJS).to.have.property('Client');
    expect(DashJS.Client.constructor.name).to.be.equal('Function')
  });
  it('should create an instance', function () {
    instanceWithoutWallet = new DashJS.Client();
    expect(instanceWithoutWallet.network).to.equal('testnet');
    expect(instanceWithoutWallet.apps).to.deep.equal({
          dpns: { contractId: 'BSwrqgq7idvxgBWSHWsmxyoi1XHDXU1URoDVaRXFozhp' }
        }
    );

    instanceWithWallet = new DashJS.Client({mnemonic:null});
    expect(instanceWithWallet.network).to.equal('testnet');
    expect(instanceWithWallet.apps).to.deep.equal({
          dpns: { contractId: 'BSwrqgq7idvxgBWSHWsmxyoi1XHDXU1URoDVaRXFozhp' }
        }
    );
    expect(instanceWithWallet.wallet.mnemonic).to.exist;
  });
  it('should sign and verify a message', function () {
    const {account} = instanceWithWallet;
    const idKey = instanceWithWallet.account.getIdentityHDKey();
    const message = DashJS.Core.Message('hello, world');
    const signed = account.sign(message, idKey.privateKey);
    const verify = message.verify(idKey.privateKey.toAddress().toString(), signed.toString());
    expect(verify).to.equal(true);
  });
  after(()=>{
    instanceWithWallet.wallet.disconnect();
    instanceWithoutWallet.disconnect();
  })
});
