import { expect } from 'chai';

import register from './register';

describe('Platform', () => {
    describe('Names', () => {
        describe('#register', () => {
            let platformMock;
            let identityMock;

            beforeEach(async function beforeEach() {
                platformMock = {
                    apps: {
                      dpns: {
                          contractId: 'someDPNSContractId',
                      },
                    },
                    documents: {
                        create: this.sinon.stub(),
                        broadcast: this.sinon.stub(),
                    },
                };

                identityMock = {
                    getId: this.sinon.stub(),
                    getPublicKeyById: this.sinon.stub(),
                };
            });

            it('register top level domain', async () => {
                await register.call(platformMock, 'dash', identityMock);

                // @ts-ignore
                expect(identityMock.getId).to.have.been.calledOnce();
                expect(platformMock.documents.create.getCall(0).args).to.have.deep.members([
                    'dpns.preorder',
                    identityMock,
                    {
                        "saltedDomainHash": "56206d7ec5b71859eed1fb91398efc440c22f8121426beefa4f7542762a636d83e38",
                    },
                ]);
            });

            it('should register second level domain', async () => {
                await register.call(platformMock, 'user.dash', identityMock);
            });

            it('should fail if DPNS app have no contract set up', async () => {
                delete platformMock.apps.dpns.contractId;

                try {
                    await register.call(platformMock, 'user.dash', identityMock);
                } catch (e) {
                    expect(e.message).to.equal('DPNS is required to register a new name.');
                }
            });
        });
    });
});
