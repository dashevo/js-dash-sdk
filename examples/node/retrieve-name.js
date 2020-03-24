const DashJS = require('dash');

const sdkOpts = {
  network: 'testnet'
};
const sdk = new DashJS.Client(sdkOpts);

const platform = sdk.platform;

async function retrieveName(){
  const user = await platform.names.get('alice');
  console.dir({user}, {depth:5});
}
retrieveName();
