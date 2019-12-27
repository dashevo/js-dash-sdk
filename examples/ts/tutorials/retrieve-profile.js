import DashJS from "../../../src";
import schema from "../../schema.json";

const network = "testnet";
const sdkOpts = {
  network,
  // mnemonic: "arena light cheap control apple buffalo indicate rare motor valid accident isolate",
  schemas: {dashpay: schema}
};
const sdk = new DashJS.SDK(sdkOpts);

let platform = sdk.platform;
let user = platform.identities.get('alice');
console.log(user);
