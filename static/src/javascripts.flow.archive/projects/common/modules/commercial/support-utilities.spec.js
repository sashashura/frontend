/**
 * DO NOT EDIT THIS FILE
 *
 * It is not used to to build anything.
 *
 * It's just a record of the old flow types.
 *
 * Use it as a guide when converting
 * - static/src/javascripts/projects/common/modules/commercial/support-utilities.spec.js
 * to .ts, then delete it.
 */

// @flow

import { addCountryGroupToSupportLink } from 'common/modules/commercial/support-utilities';
import { setGeolocation } from 'lib/geolocation';

describe('addCountryGroupToSupportLink', () => {
    test('adds country group to subscribe link', () => {
        setGeolocation('GB');
        expect(
            addCountryGroupToSupportLink(
                'https://support.theguardian.com/subscribe'
            )
        ).toEqual('https://support.theguardian.com/uk/subscribe');
    });

    test('adds country group to contribute link', () => {
        setGeolocation('FR');
        expect(
            addCountryGroupToSupportLink(
                'https://support.theguardian.com/contribute'
            )
        ).toEqual('https://support.theguardian.com/eu/contribute');
    });

    test('does not add country group to contribute link with country group already in it', () => {
        setGeolocation('GB');
        expect(
            addCountryGroupToSupportLink(
                'https://support.theguardian.com/int/contribute'
            )
        ).toEqual('https://support.theguardian.com/int/contribute');
    });
});