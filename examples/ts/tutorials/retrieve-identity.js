import DashJS from "../../../src";
import schema from "../../schema.json";
import {PrivateKey} from "@dashevo/dashcore-lib";

const network = "testnet";
const sdkOpts = {
  network,
  // mnemonic: "arena light cheap control apple buffalo indicate rare motor valid accident isolate",
  mnemonic: "bring pledge solid dance age arena raise recycle orbit mango lyrics gorilla",
  apps: {
    dashpay: {
      contractId: 12345,
      schema
    }
  }
};
const sdk = new DashJS.SDK(sdkOpts);

const getIdentity = async function () {
  let platform = sdk.platform;
  await sdk.isReady();

  platform
      .identities
      .get('3GegupTgRfdN9JMS8R6QXF3B2VbZtiw63eyudh1oMJAk')
      .then((identity) => {
        console.log({identity});
      });

};
getIdentity();



