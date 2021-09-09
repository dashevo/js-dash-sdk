import 'mocha';
import { expect } from 'chai';
import { createAccountReference } from "./createAccountReference";

describe('DashPayPlugin - createAccountReference', () => {
    it('create an account reference', function () {
        const senderPrivateKeyBuffer = Buffer.from('2fc4145c8b7a871c42e32733a83c36f9b0d0eb646f40e53cb9ae0f48669ab0d7', 'hex');
        const extendedPublicKey = Buffer.from('tpubDMDatc2kPVD8R6hW2gQnmNDJ4xANWYueibmhPJoRnCjnagrTrRdFCDrzwD4bWaacsL4mms8dRyvWNLtzFYCuguTcXQRbiza1FnnFKT21GC6', 'hex');

        expect(createAccountReference(senderPrivateKeyBuffer, extendedPublicKey)).to.deep.equal(91081467);
    });

});
