import type { Participations } from '@guardian/ab-core';
import {
	clearPermutiveSegments,
	getPermutiveSegments,
} from '@guardian/commercial-core';
import { getContentTargeting } from '@guardian/commercial-core/dist/esm/targeting/content';
import type { PersonalisedTargeting } from '@guardian/commercial-core/dist/esm/targeting/personalised';
import { getPersonalisedTargeting } from '@guardian/commercial-core/dist/esm/targeting/personalised';
import { getSessionTargeting } from '@guardian/commercial-core/dist/esm/targeting/session';
import { getSharedTargeting } from '@guardian/commercial-core/dist/esm/targeting/shared';
import { getViewportTargeting } from '@guardian/commercial-core/dist/esm/targeting/viewport';
import { cmp, onConsentChange } from '@guardian/consent-management-platform';
import type { ConsentState } from '@guardian/consent-management-platform/dist/types';
import type { TCFv2ConsentList } from '@guardian/consent-management-platform/dist/types/tcfv2';
import type { CountryCode } from '@guardian/libs';
import { getCookie, isObject, isString, log, storage } from '@guardian/libs';
import { once } from 'lodash-es';
import config from '../../../../lib/config';
import { getReferrer as detectGetReferrer } from '../../../../lib/detect';
import { getTweakpoint, getViewport } from '../../../../lib/detect-viewport';
import { getCountryCode } from '../../../../lib/geolocation';
import { removeFalseyValues } from '../../../commercial/modules/header-bidding/utils';
import { getSynchronousParticipations } from '../experiments/ab';
import { isUserLoggedIn } from '../identity/api';
import { commercialFeatures } from './commercial-features';

// https://admanager.google.com/59666047#inventory/custom_targeting/list

const { ophan, tests, page, isDotcomRendering } = window.guardian.config;

const contentTargeting = getContentTargeting({
	renderingPlatform: isDotcomRendering
		? 'dotcom-rendering'
		: 'dotcom-platform',
	eligibleForDCR: true,
	sensitive: page.isSensitive,
	section: page.section,
	videoLength: page.videoDuration,
	path: `/${page.pageId}`,
});

getSessionTargeting(
	document.referrer,
	{
		clientSideParticipations: getSynchronousParticipations(),
		serverSideParticipations: tests ?? {},
	},
	{
		at: getCookie({ name: 'adtest', shouldMemoize: true }),
		cc: getCountryCode(),
		pv: ophan.pageViewId,
		si: isUserLoggedIn() ? 't' : 'f',
	},
);

let personalisedTargeting: PersonalisedTargeting;

let viewportTargeting = getViewportTargeting(getViewport().width, true);

void cmp.willShowPrivacyMessage().then((willShow) => {
	viewportTargeting = getViewportTargeting(getViewport().width, willShow);
});

const sharedTargeting = getSharedTargeting(
	// @ts-expect-error -- this is the SharedTargeting object
	page.sharedAdTargeting,
);

const adFreeTargeting = commercialFeatures.adFree ? ({ af: 't' } as const) : {};

type TrueOrFalse = 't' | 'f';

type PartialWithNulls<T> = { [P in keyof T]?: T[P] | null };

const frequency = [
	'0',
	'1',
	'2',
	'3',
	'4',
	'5',
	'6-9',
	'10-15',
	'16-19',
	'20-29',
	'30plus',
] as const;

const adManagerGroups = [
	'1',
	'2',
	'3',
	'4',
	'5',
	'6',
	'7',
	'8',
	'9',
	'10',
	'11',
	'12',
] as const;

type Frequency = typeof frequency[number];
type AdManagerGroup = typeof adManagerGroups[number];
type ContentType =
	| 'video'
	| 'tag'
	| 'section'
	| 'network-front'
	| 'liveblog'
	| 'interactive'
	| 'gallery'
	| 'crossword'
	| 'audio'
	| 'article';

type PageTargeting = PartialWithNulls<{
	ab: string[];
	at: string; // Ad Test
	bl: string[]; // BLog tags
	bp: 'mobile' | 'tablet' | 'desktop'; // BreakPoint
	cc: CountryCode; // Country Code
	co: string[]; // COntributor
	ct: ContentType;
	dcre: TrueOrFalse; // DotCom-Rendering Eligible
	edition: 'uk' | 'us' | 'au' | 'int';
	k: string[]; // Keywords
	p: 'r2' | 'ng' | 'app' | 'amp'; // Platform (web)
	pa: TrueOrFalse; // Personalised Ads consent
	permutive: string[]; // predefined segment values
	pv: string; // ophan Page View id
	rp: 'dotcom-rendering' | 'dotcom-platform'; // Rendering Platform
	sens: TrueOrFalse; // SenSitive
	si: TrueOrFalse; // Signed In
	skinsize: 'l' | 's';
	su: string[]; // SUrging article
	tn: string[]; // ToNe
	url: string;
	urlkw: string[]; // URL KeyWords
	vl: string; // Video Length
	rdp: string;
	consent_tcfv2: string;
	cmp_interaction: string;
	se: string[]; // SEries
	ob: 't'; // OBserver content
	br: 's' | 'p' | 'f'; // BRanding
	af: 't'; // Ad Free
	fr: Frequency; // FRequency
	ref: string; // REFerrer
	inskin: TrueOrFalse; // InSkin
	amtgrp: AdManagerGroup;
	s: string; // site Section

	// And more
	[_: string]: string | string[];
}>;

let myPageTargeting: PageTargeting = {};
let latestCmpHasInitialised: boolean;
let latestCMPState: ConsentState | null = null;
const AMTGRP_STORAGE_KEY = 'gu.adManagerGroup';

const findBreakpoint = (): 'mobile' | 'tablet' | 'desktop' => {
	const width = getViewport().width;
	switch (getTweakpoint(width)) {
		case 'mobile':
		case 'mobileMedium':
		case 'mobileLandscape':
			return 'mobile';
		case 'phablet':
		case 'tablet':
			return 'tablet';
		case 'desktop':
		case 'leftCol':
		case 'wide':
			return 'desktop';
	}
};

const skinsizeTargeting = () => {
	const vp = getViewport();
	return vp.width >= 1560 ? 'l' : 's';
};

const inskinTargeting = (): TrueOrFalse => {
	// Don’t show inskin if we cannot tell if a privacy message will be shown
	if (!cmp.hasInitialised()) return 'f';
	return cmp.willShowPrivacyMessageSync() ? 'f' : 't';
};

const abParam = (): string[] => {
	const abParticipations: Participations = getSynchronousParticipations();
	const abParams: string[] = [];

	const pushAbParams = (testName: string, testValue: unknown): void => {
		if (typeof testValue === 'string' && testValue !== 'notintest') {
			const testData = `${testName}-${testValue}`;
			// DFP key-value pairs accept value strings up to 40 characters long
			abParams.push(testData.substring(0, 40));
		}
	};

	Object.keys(abParticipations).forEach((testKey: string): void => {
		const testValue: {
			variant: string;
		} = abParticipations[testKey];
		pushAbParams(testKey, testValue.variant);
	});

	const tests = window.guardian.config.tests;

	if (isObject(tests)) {
		Object.entries(tests).forEach(([testName, testValue]) => {
			pushAbParams(testName, testValue);
		});
	}

	return abParams;
};

const getFrequencyValue = (): Frequency => {
	const visitCount: number = parseInt(
		storage.local.getRaw('gu.alreadyVisited') ?? '0',
		10,
	);

	if (visitCount <= 5) {
		return frequency[visitCount];
	} else if (visitCount >= 6 && visitCount <= 9) {
		return '6-9';
	} else if (visitCount >= 10 && visitCount <= 15) {
		return '10-15';
	} else if (visitCount >= 16 && visitCount <= 19) {
		return '16-19';
	} else if (visitCount >= 20 && visitCount <= 29) {
		return '20-29';
	} else if (visitCount >= 30) {
		return '30plus';
	}

	return '0';
};

const getReferrer = (): string | null => {
	type MatchType = {
		id: string;
		match: string;
	};

	const referrerTypes: MatchType[] = [
		{
			id: 'facebook',
			match: 'facebook.com',
		},
		{
			id: 'twitter',
			match: 't.co/',
		}, // added (/) because without slash it is picking up reddit.com too
		{
			id: 'reddit',
			match: 'reddit.com',
		},
		{
			id: 'google',
			match: 'www.google',
		},
	];

	const matchedRef: MatchType =
		referrerTypes.filter((referrerType) =>
			detectGetReferrer().includes(referrerType.match),
		)[0] || {};

	return matchedRef.id;
};

const getUrlKeywords = (pageId?: string): string[] => {
	if (!pageId) return [];

	const segments = pageId.split('/');
	const noEmptyStrings = segments.filter(Boolean); // This handles a trailing slash
	const keywords =
		noEmptyStrings.length > 0
			? noEmptyStrings[noEmptyStrings.length - 1].split('-')
			: [];
	return keywords;
};

const formatAppNexusTargeting = (obj: Record<string, string | string[]>) => {
	const asKeyValues = Object.entries(obj).map((entry) => {
		const [key, value] = entry;
		return Array.isArray(value)
			? value.map((nestedValue) => `${key}=${nestedValue}`)
			: `${key}=${value}`;
	});

	const flattenDeep = Array.prototype.concat.apply([], asKeyValues);
	return flattenDeep.join(',');
};

const buildAppNexusTargetingObject = once(
	(pageTargeting: PageTargeting): Record<string, string | string[]> =>
		removeFalseyValues({
			sens: pageTargeting.sens,
			pt1: pageTargeting.url,
			pt2: pageTargeting.edition,
			pt3: pageTargeting.ct,
			pt4: pageTargeting.p,
			pt5: pageTargeting.k,
			pt6: pageTargeting.su,
			pt7: pageTargeting.bp,
			pt9: [pageTargeting.pv, pageTargeting.co, pageTargeting.tn].join(
				'|',
			),
			permutive: pageTargeting.permutive,
		}),
);

const buildAppNexusTargeting = once((pageTargeting: PageTargeting): string =>
	formatAppNexusTargeting(buildAppNexusTargetingObject(pageTargeting)),
);

const getRdpValue = (ccpaState: boolean | null): string => {
	if (ccpaState === null) {
		return 'na';
	}
	return ccpaState ? 't' : 'f';
};

const consentedToAllPurposes = (consents: TCFv2ConsentList): boolean => {
	return (
		Object.keys(consents).length > 0 &&
		Object.values(consents).every(Boolean)
	);
};

const getTcfv2ConsentValue = (state: ConsentState | null): string => {
	if (!state || !state.tcfv2) return 'na';

	return consentedToAllPurposes(state.tcfv2.consents) ? 't' : 'f';
};

const getAdConsentFromState = (state: ConsentState | null): boolean => {
	if (!state) return false;

	if (state.ccpa) {
		// CCPA mode
		return !state.ccpa.doNotSell;
	} else if (state.tcfv2) {
		// TCFv2 mode
		return consentedToAllPurposes(state.tcfv2.consents);
	} else if (state.aus) {
		// AUS mode
		return state.aus.personalisedAdvertising;
	}
	// Unknown mode
	return false;
};

const isAdManagerGroup = (s: string | null): s is AdManagerGroup =>
	adManagerGroups.some((g) => g === s);

const getAdManagerGroup = (consented = true): AdManagerGroup | null => {
	if (!consented) return null;
	const existingGroup = storage.local.getRaw(AMTGRP_STORAGE_KEY);

	return isAdManagerGroup(existingGroup)
		? existingGroup
		: createAdManagerGroup();
};

const createAdManagerGroup = (): AdManagerGroup => {
	const group =
		adManagerGroups[Math.floor(Math.random() * adManagerGroups.length)];
	storage.local.setRaw(AMTGRP_STORAGE_KEY, group);
	return group;
};

const filterEmptyValues = (pageTargets: Record<string, unknown>) => {
	const filtered: Record<string, string | string[]> = {};
	for (const key in pageTargets) {
		const value = pageTargets[key];
		if (isString(value)) {
			filtered[key] = value;
		} else if (
			Array.isArray(value) &&
			value.length > 0 &&
			value.every(isString)
		) {
			filtered[key] = value;
		}
	}
	return filtered;
};

const rebuildPageTargeting = (adTargeting: PageTargeting) => {
	// filter out empty values
	const pageTargeting: Record<string, string | string[]> =
		filterEmptyValues(adTargeting);

	// third-parties wish to access our page targeting, before the googletag script is loaded.
	page.appNexusPageTargeting = buildAppNexusTargeting(pageTargeting);

	// This can be removed once we get sign-off from third parties who prefer to use appNexusPageTargeting.
	page.pageAdTargeting = pageTargeting;

	log('commercial', 'pageTargeting object:', pageTargeting);

	return pageTargeting;
};

const getPageTargeting = (): PageTargeting => {
	// First call binds to onConsentChange and returns {}
	onConsentChange((state) => {
		personalisedTargeting = getPersonalisedTargeting(state);
	});

	const adTargeting = {
		...viewportTargeting,
		...personalisedTargeting,
		...contentTargeting,
		...sharedTargeting,
		...adFreeTargeting,
	};

	rebuildPageTargeting(adTargeting);

	return adTargeting;
};

const resetPageTargeting = (): void => {
	myPageTargeting = {};
};

export {
	getPageTargeting,
	buildAppNexusTargeting,
	buildAppNexusTargetingObject,
};

export const _ = {
	resetPageTargeting,
};
