const network = "testnet";
const opts = {
  network,
  mnemonic: "arena light cheap control apple buffalo indicate rare motor valid accident isolate",
  apps: {
    dashpay: {
    contractId: ''// Provide the dashpay contract id here
    }
  }
};
const sdk = new DashJS.SDK(opts);
sdk.isReady().then(()=>{
  const {account, platform} = sdk;

  async function sendPayment() {
    const tx = await account.createTransaction({recipient: 'yLptqWxjgTxtwKJuLHoGY222NnoeqYuN8h', satoshis: 12000});
    console.log(await account.broadcastTransaction(tx));
  }

  async function readDocument() {
    const profile = await platform.documents.fetch('dashpay.profile', opts);
    console.log(profile);
  }
});
