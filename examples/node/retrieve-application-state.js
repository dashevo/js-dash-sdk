import DashJS from '../../../src';
import schema from '../../schema.json';

const sdkOpts = {
  network: 'testnet',
  apps: {
    dpns: {
      contractId: '2KfMcMxktKimJxAZUeZwYkFUsEcAZhDKEpQs8GMnpUse',
      schema
    }
  }
};
const sdk = new DashJS.SDK(sdkOpts);

async function readDocument() {
  await sdk.isReady();

  const queryOpts = {

  };
  const profile = await sdk.platform.documents.get('dpns.domain', queryOpts);
  console.log(profile);
}

readDocument();
