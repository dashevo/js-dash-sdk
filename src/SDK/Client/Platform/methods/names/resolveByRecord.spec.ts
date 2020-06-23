import { expect } from 'chai';

import resolveByRecord from './resolveByRecord';

describe('Platform', () => {
    describe('Names', () => {
        describe('#resolveByRecord', () => {
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

            it('should resolve domain by it\'s record', async () => {
                platformMock.documents.get.resolves([parentDomainDocument]);

                const receivedDocument = await resolveByRecord.call(
                    platformMock, 'recordName', 'recordValue',
                );

                // @ts-ignore
                expect(platformMock.documents.get).to.have.been.calledOnceWithExactly('dpns.domain', {
                    where: [['records.recordName', '==', 'recordValue']],
                });

                expect(receivedDocument).to.deep.equal(parentDomainDocument);
            });

            it('should return null if domain was not found', async () => {
                platformMock.documents.get.resolves([]);

                const receivedDocument = await resolveByRecord.call(
                    platformMock, 'recordName', 'recordValue',
                );

                // @ts-ignore
                expect(platformMock.documents.get).to.have.been.calledOnceWithExactly('dpns.domain', {
                    where: [['records.recordName', '==', 'recordValue']],
                });

                expect(receivedDocument).to.be.null;
            });
        });
    });
});
