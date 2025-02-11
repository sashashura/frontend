import { removeCookie, setCookie } from '@guardian/libs';
import { _ } from '../../../../lib/geolocation';
import { addCountryGroupToSupportLink } from './support-utilities';

jest.mock('lib/raven');
const { countryCookieName } = _;

describe('addCountryGroupToSupportLink', () => {
	beforeEach(() => {
		removeCookie({ name: countryCookieName });
	});

	test('adds country group to subscribe link', async () => {
		setCookie({ name: countryCookieName, value: 'GB' });
		expect(
			await addCountryGroupToSupportLink(
				'https://support.theguardian.com/subscribe',
			),
		).toEqual('https://support.theguardian.com/uk/subscribe');
	});

	test('adds country group to contribute link', async () => {
		setCookie({ name: countryCookieName, value: 'FR' });
		expect(
			await addCountryGroupToSupportLink(
				'https://support.theguardian.com/contribute',
			),
		).toEqual('https://support.theguardian.com/eu/contribute');
	});

	test('does not add country group to contribute link with country group already in it', async () => {
		setCookie({ name: countryCookieName, value: 'GB' });
		expect(
			await addCountryGroupToSupportLink(
				'https://support.theguardian.com/int/contribute',
			),
		).toEqual('https://support.theguardian.com/int/contribute');
	});
});
