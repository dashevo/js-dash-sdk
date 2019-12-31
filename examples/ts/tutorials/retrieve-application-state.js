import DashJS from "../../../src";
import schema from "../../schema.json";

const network = "testnet";
const sdkOpts = {
  network,
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
