import { expect } from 'chai';
import {SDK} from "../../../src/DashJS/SDK";
import 'mocha';

describe('DashJS - SDK', () => {

  it('should provide expected class', function () {
    expect(SDK.name).to.be.equal('SDK')
    expect(SDK.constructor.name).to.be.equal('Function')
  });
  it('should be instantiable', function () {
    const sdk = new SDK();
    expect(sdk).to.exist;
    expect(sdk.network).to.be.equal('testnet');
    expect(sdk.client.constructor.name).to.be.equal('DAPIClient')
  });
  it('should initiate wallet lib in offline mode without mnemonic', function () {
    const sdk = new SDK();
    expect(sdk.wallet.offlineMode).to.be.equal(true)
  });
});
