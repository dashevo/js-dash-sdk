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

let platform = sdk.platform;

console.log(sdk.account.getUnusedAddress());
platform.identities.create('obusco').then((res)=>{
  console.log({res});
});


