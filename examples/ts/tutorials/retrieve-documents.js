import DashJS from '../../../src';

const sdkOpts = {
  network: 'testnet'
};
const sdk = new DashJS.SDK(sdkOpts);

const getDocuments = async function () {
  let platform = sdk.platform;
  await sdk.isReady();

  platform
      .documents
      .get('dpns.domain', {})
      .then((documents) => {
        console.dir({documents},{depth:5});
      });

};
getDocuments();
