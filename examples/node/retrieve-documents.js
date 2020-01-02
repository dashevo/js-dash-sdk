import DashJS from '../../src';

const sdkOpts = {
  network: 'testnet'
};
const sdk = new DashJS.SDK(sdkOpts);

const getDocuments = async function () {
  let platform = sdk.platform;
  await sdk.isReady();

  const documents = await platform.documents.get('dpns.domain', {});
  console.dir({documents},{depth:5});
};
getDocuments();
