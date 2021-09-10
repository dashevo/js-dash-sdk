import 'mocha';
import { expect } from 'chai';
import { createAccountReference } from "./createAccountReference";
import { HDPublicKey, PrivateKey } from "@dashevo/dashcore-lib";

describe('DashPayPlugin - createAccountReference', () => {
    it('create an account reference', function () {
        const senderPrivateKey = new PrivateKey('2fc4145c8b7a871c42e32733a83c36f9b0d0eb646f40e53cb9ae0f48669ab0d7');
        const extendedPublicKey = new HDPublicKey('tpubDMDatc2kPVD8R6hW2gQnmNDJ4xANWYueibmhPJoRnCjnagrTrRdFCDrzwD4bWaacsL4mms8dRyvWNLtzFYCuguTcXQRbiza1FnnFKT21GC6');

        expect(createAccountReference(senderPrivateKey.toBuffer(), extendedPublicKey.toBuffer())).to.deep.equal(93353124);
    });

});
