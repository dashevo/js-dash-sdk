import 'mocha';
import { expect } from 'chai';
import { decryptAccountLabel } from "./decryptAccountLabel";

describe('DashPayPlugin - decryptAccountLabel', () => {
    it('should decrypt an account label', function () {
        const sharedSecret = '0ec54a54b97988862cadf92b0f09337f9aabee0ecfbedaac23a635264a3a39e5';
        const accountLabel = 'Default account';
        const encryptedAccountLabel = '9b29fd8ae4da9bb47e5292a513a8d39881a3b55991c9bb18b2584ad0ecea99bdd19f3bc3efdb07c2402bbb75964f8950';

        expect(decryptAccountLabel(encryptedAccountLabel, sharedSecret)).to.deep.equal(accountLabel);
    });

});
