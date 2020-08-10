import { expect } from 'chai';
import { ImportMock } from 'ts-mock-imports';

import entropyModule from '@dashevo/dpp/lib/util/entropy';

ImportMock.mockFunction(entropyModule, 'generate', 'VdFfaQCbqbrE7da');

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
                const identityId = 'someIdentityId';
                identityMock.getId.returns(identityId);

                await register.call(platformMock, 'Dash', identityMock, {
                    dashUniqueIdentityId: identityId,
                });

                expect(platformMock.documents.create.getCall(0).args[0]).to.deep.equal('dpns.preorder');
                expect(platformMock.documents.create.getCall(0).args[1]).to.deep.equal(identityMock);
                expect(platformMock.documents.create.getCall(0).args[2].saltedDomainHash.toString('hex')).to.deep.equal(
                    '736f6d65456e74726f7079562060f0833932a21446ada9b0bb71ac8e8b40e2618f99f44204d66815f6bdf258cc',
                );

                expect(platformMock.documents.create.getCall(1).args).to.have.deep.members([
                    'dpns.domain',
                    identityMock,
                    {
                        'label': 'Dash',
                        'normalizedLabel': 'dash',
                        'normalizedParentDomainName': '',
                        'preorderSalt': Buffer.from('736f6d65456e74726f7079', 'hex'),
                        'records': {
                            'dashUniqueIdentityId': 'someIdentityId',
                        },
                        'subdomainRules': {
                            'allowSubdomains': false,
                        },
                    }
                ]);
            });

            it('should register second level domain', async () => {
                const identityId = 'someIdentityId';
                identityMock.getId.returns(identityId);

                await register.call(platformMock, 'User.dash', identityMock, {
                    dashAliasIdentityId: identityId,
                });

                expect(platformMock.documents.create.getCall(0).args[0]).to.deep.equal('dpns.preorder');
                expect(platformMock.documents.create.getCall(0).args[1]).to.deep.equal(identityMock);
                expect(platformMock.documents.create.getCall(0).args[2].saltedDomainHash.toString('hex')).to.deep.equal(
                    '736f6d65456e74726f70795620b5f42fb635a08cc0f441bbc6ef5f3bdeed2877692feffd9945bde3abf8b4141f',
                );

                expect(platformMock.documents.create.getCall(1).args).to.have.deep.members([
                    'dpns.domain',
                    identityMock,
                    {
                        'label': 'User',
                        'normalizedLabel': 'user',
                        'normalizedParentDomainName': 'dash',
                        'preorderSalt': Buffer.from('736f6d65456e74726f7079', 'hex'),
                        'records': {
                            'dashAliasIdentityId': 'someIdentityId',
                        },
                        'subdomainRules': {
                            'allowSubdomains': false,
                        },
                    }
                ]);
            });

            it('should fail if DPNS app have no contract set up', async () => {
                delete platformMock.apps.dpns.contractId;

                try {
                    await register.call(platformMock, 'user.dash', identityMock, {
                        dashUniqueIdentityId: 'someIdentityId',
                    });
                } catch (e) {
                    expect(e.message).to.equal('DPNS is required to register a new name.');
                }
            });
        });
    });
});
