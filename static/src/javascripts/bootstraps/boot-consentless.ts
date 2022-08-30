import { initArticleInline } from 'commercial/modules/consentless/dynamic/article-inline';
import { initLiveblogInline } from 'commercial/modules/consentless/dynamic/liveblog-inline';
import { initFixedSlots } from 'commercial/modules/consentless/init-fixed-slots';
import { initConsentless } from 'commercial/modules/consentless/prepare-ootag';
import {
	AdFreeCookieReasons,
	maybeUnsetAdFreeCookie,
} from 'lib/manage-ad-free-cookie';
import { init as setAdTestCookie } from '../projects/commercial/modules/set-adtest-cookie';

const bootConsentless = async (): Promise<void> => {
	/*  In the consented ad stack, we set the ad free cookie for users who
		don't consent to targeted ads in order to hide empty ads slots.
		We remove the cookie here so that we can show Opt Out ads.
		TODO: Stop setting ad free cookie for users who opt out when
		consentless ads are rolled out to all users.
 	*/
	maybeUnsetAdFreeCookie(AdFreeCookieReasons.ConsentOptOut);

	await Promise.all([
		setAdTestCookie(),
		initConsentless(),
		initFixedSlots(),
		initArticleInline(),
		initLiveblogInline(),
	]);
};

export { bootConsentless };
