import { expect } from 'chai';
import {SDK} from "../../../src/DashJS/SDK";
import 'mocha';
import {DashJS} from "../../../src/DashJS";

describe('DashJS - SDK', () => {

  it('should provide expected class', function () {
    expect(SDK.name).to.be.equal('SDK')
    expect(SDK.constructor.name).to.be.equal('Function')
  });
});
