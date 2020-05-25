const { expect } = chai;
const { Client } = Dash;
const mnemonic = 'advance garment concert scatter west fringe hurdle estate bubble angry hungry dress';

describe('SDK', function suite() {
  this.timeout(100000);
  let client;
  describe('Client', () => {
    it('should work', async function () {
      client = new Client({
        mnemonic,
      });
      expect(client.state.isReady).to.equal(false);
      await client.isReady();
      expect(client.state.isReady).to.equal(true);
      expect(client.apps).to.deep.equal({
            dpns: { contractId: '7PBvxeGpj7SsWfvDSa31uqEMt58LAiJww7zNcVRP1uEM' }
          }
      );
    });
    it('should sign and verify a message', function () {
      const {account} = client;
      const idKey = account.getIdentityHDKey();
      // This transforms from a Wallet-Lib.PrivateKey to a Dashcore-lib.PrivateKey.
      // It will quickly be annoying to perform this, and we therefore need to find a better solution for that.
      const privateKey = Dash.Core.PrivateKey(idKey.privateKey);
      const message = Dash.Core.Message('hello, world');
      const signed = message.sign(privateKey);
      const verify = message.verify(idKey.privateKey.toAddress().toString(), signed.toString());
      expect(verify).to.equal(true);
    });
  });
  after(async ()=>{
    await client.disconnect();
  })

});
