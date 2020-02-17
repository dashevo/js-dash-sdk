const DashJS = require('dash');

const sdkOpts = {
  network: 'testnet',
  mnemonic: null,
};

const sdk = new DashJS.SDK(sdkOpts);

const message = new DashJS.Message('hello, world');

const signAndVerify = async function () {
  const {account, wallet} = sdk;

  const mnemonic = wallet.exportWallet();
  console.log('Mnemonic:', mnemonic);

  const idKey = account.getIdentityHDKey()
  const idPrivateKey = idKey.privateKey;
  const idAddress = idPrivateKey.toAddress().toString()

  const signed = account.sign(message, idPrivateKey);
  const verify = message.verify(idAddress, signed.toString());
  console.log(verify);
};
sdk.isReady().then(signAndVerify);

