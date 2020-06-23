import { expect } from 'chai';

import search from './search';

describe('Platform', () => {
    describe('Names', () => {
        describe('#search', () => {
            let platformMock;
            let parentDomainDocument;
            let childDomainDocument;

            beforeEach(async function beforeEach() {
                parentDomainDocument = { label: 'parent' };
                childDomainDocument = { label: 'child.parent' };

                platformMock = {
                    documents: {
                        get: this.sinon.stub(),
                    },
                };
            });

            it('should return a list of searched domains', async () => {
                platformMock.documents.get.resolves([parentDomainDocument]);

                const documentsList = await search.call(
                    platformMock, 'prefix', 'dash',
                );

                // @ts-ignore
                expect(platformMock.documents.get).to.have.been.calledOnceWithExactly('dpns.domain', {
                    where: [
                        ["normalizedParentDomainName", "==", "dash"],
                        ["normalizedLabel", "startsWith", "prefix"]
                    ],
                });

                expect(documentsList).to.have.deep.members([parentDomainDocument]);
            });

            it('should return an empty list if no domains where found', async () => {
                platformMock.documents.get.resolves([]);

                const documentsList = await search.call(
                    platformMock, 'prefix', 'dash',
                );

                // @ts-ignore
                expect(platformMock.documents.get).to.have.been.calledOnceWithExactly('dpns.domain', {
                    where: [
                        ["normalizedParentDomainName", "==", "dash"],
                        ["normalizedLabel", "startsWith", "prefix"]
                    ],
                });

                expect(documentsList).to.deep.equal([]);
            });
        });
    });
});
