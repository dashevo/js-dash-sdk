import DashJS from "../../../src";

const network = "testnet";
const sdkOpts = {
  network,
};
const sdk = new DashJS.SDK(sdkOpts);

const platform = sdk.platform;

async function retrieveProfile(){
  const user = await platform.names.get('dana');
  console.dir({user}, {depth:5});
}
retrieveProfile();
