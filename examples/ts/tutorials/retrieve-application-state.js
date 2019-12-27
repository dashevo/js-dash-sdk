import DashJS from "../../../src";
import schema from "../../schema.json";

const network = "testnet";
const sdkOpts = {
  network,
  mnemonic: "arena light cheap control apple buffalo indicate rare motor valid accident isolate",
  apps: {
    dashpay: {
      contractId: 12345,
      schema
    }
  }
};
const sdk = new DashJS.SDK(sdkOpts);
// const acc = sdk.wallet.getAccount();
readDocument();

async function readDocument() {
  const queryOpts = {
  };
  const profile = await sdk.platform.documents.fetch('profile', queryOpts);
  console.log(profile);
}
