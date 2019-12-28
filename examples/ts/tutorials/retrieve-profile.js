import DashJS from "../../../src";
import schema from "../../schema.json";

const network = "testnet";
const sdkOpts = {
  network,
  // mnemonic: "arena light cheap control apple buffalo indicate rare motor valid accident isolate",
  apps: {
    dashpay: {
      contractId: 12345,
      schema
    }
  }
};
const sdk = new DashJS.SDK(sdkOpts);

const platform = sdk.platform;

async function retrieveProfile(){
  const user = await platform.identities.get('bob');
  console.log({user});
}
retrieveProfile();
