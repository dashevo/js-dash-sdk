import Identifier from "@dashevo/dpp/lib/Identifier";
import {expect} from 'chai';
import {ClientApps} from "./ClientApps";
import 'mocha';

describe('ClientApps', () => {
    let apps;
    let appsFromProps;
    it('constructor', function () {
        apps = new ClientApps();
        expect(apps.apps).to.deep.equal({});
        appsFromProps = new ClientApps([{
            contractId: '3VvS19qomuGSbEYWbTsRzeuRgawU3yK4fPMzLrbV62u8',
            contract: null,
            aliases: ['dpns'],
        }]);
    });
    it('.set', function () {
        apps.set('dpns', {
            contractId: '3VvS19qomuGSbEYWbTsRzeuRgawU3yK4fPMzLrbV62u8',
            contract: { someField: true }
        });
        apps.set('tutorialContract', {
            contractId: '3VvS19qomuGSbEYWbTsRzeuRgawU3yK4fPMzLrbV62u8',
            contract: { someField: true }
        });
    });
    it('should get', function () {
        const getByName = apps.get('dpns');
        expect(getByName).to.deep.equal({
            "contractId": Identifier.from("3VvS19qomuGSbEYWbTsRzeuRgawU3yK4fPMzLrbV62u8"),
            "contract": { someField: true }
        })
    });

    it('should .getIdentifiers()', function () {
        const identifiers = apps.getIdentifiers();
        expect(identifiers).to.deep.equal([
            Identifier.from('3VvS19qomuGSbEYWbTsRzeuRgawU3yK4fPMzLrbV62u8'),
            Identifier.from('3VvS19qomuGSbEYWbTsRzeuRgawU3yK4fPMzLrbV62u9')
        ]);
    });
    it('should .getAliases()', function () {
        const aliases = apps.getAliases();
        expect(aliases).to.deep.equal(['tutorialContract', 'contract', 'dpns']);
    });
    it('should .has', function () {
        expect(apps.has('dpns')).to.equal(true);
        expect(apps.has('tutorialContract')).to.equal(true);
        expect(apps.has('tutorialContractt')).to.equal(false);
    });
});
