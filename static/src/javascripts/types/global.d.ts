type ServerSideABTest = `${string}${'Variant' | 'Control'}`;

declare const twttr: {
	widgets?: {
		load?: (arg0: Element | null | undefined) => void;
	};
};

declare type TagAtrribute = {
	name: string;
	value: string;
};

declare type ThirdPartyTag = {
	shouldRun: boolean;
	url?: string;
	name?: string;
	onLoad?: () => void;
	beforeLoad?: () => void;
	useImage?: boolean;
	attrs?: TagAtrribute[];
	async?: boolean;
	loaded?: boolean;
	insertSnippet?: () => void;
};

declare const jsdom: {
	reconfigure: (settings: Record<string, unknown>) => void;
};

declare module '*.svg' {
	const content: { markup: string };
	// eslint-disable-next-line import/no-default-export -- allow svg imports
	export default content;
}

declare module 'ophan/ng' {
	const ophan: Ophan;
	// eslint-disable-next-line import/no-default-export -- that’s the ophan way
	export default ophan;
}

// This comes from Scala:
// https://github.com/guardian/frontend/blob/main/common/app/common/commercial/PrebidIndexSite.scala#L10
// https://github.com/guardian/frontend/blob/main/common/app/views/support/JavaScriptPage.scala#L54
type PrebidBreakpoint = 'D' | 'T' | 'M';
type PrebidIndexSite = {
	bp: PrebidBreakpoint;
	id: number;
};

// This comes from Scala:
// https://github.com/guardian/frontend/blob/main/common/app/model/meta.scala#L349
type AdUnit = string;

interface CommercialPageConfig {
	pbIndexSites: PrebidIndexSite[];
	adUnit: AdUnit;
	appNexusPageTargeting?: string;
	sharedAdTargeting?: Record<string, string | string[]>;
	pageAdTargeting?: Record<string, string | string[]>;
	dfpAccountId: string;
}

interface Config {
	ophan: {
		// somewhat redundant with guardian.ophan
		pageViewId: string;
		browserId?: string;
	};
	page: PageConfig;
	switches: Record<string, boolean | undefined>;
	tests?: {
		[key: `${string}Control`]: 'control';
		[key: `${string}Variant`]: 'variant';
	};
	isDotcomRendering: boolean;
}

type Edition = string; // https://github.com/guardian/frontend/blob/b952f6b9/common/app/views/support/JavaScriptPage.scala#L79

interface LightboxImages {
	images: Array<{ src: string }>;
}

interface PageConfig extends CommercialPageConfig {
	ajaxUrl: string; // https://github.com/guardian/frontend/blob/33db7bbd/common/app/views/support/JavaScriptPage.scala#L72
	assetsPath: string;
	authorIds: string;
	blogIds: string;
	contentType: string;
	edition: Edition;
	frontendAssetsFullURL?: string; // only in DCR
	hasInlineMerchandise: boolean;
	hasPageSkin: boolean; // https://github.com/guardian/frontend/blob/b952f6b9/common/app/views/support/JavaScriptPage.scala#L48
	hasShowcaseMainElement: boolean;
	host: string;
	isDev: boolean; // https://github.com/guardian/frontend/blob/33db7bbd/common/app/views/support/JavaScriptPage.scala#L73
	isFront: boolean; // https://github.com/guardian/frontend/blob/201cc764/common/app/model/meta.scala#L352
	isHosted: boolean; // https://github.com/guardian/frontend/blob/66afe02e/common/app/common/commercial/hosted/HostedMetadata.scala#L37
	isImmersive?: boolean;
	isLiveBlog?: boolean;
	isPaidContent: boolean;
	isProd: boolean; // https://github.com/guardian/frontend/blob/33db7bbd/common/app/views/support/JavaScriptPage.scala
	isSensitive: boolean;
	keywordIds: string;
	keywords: string;
	lightboxImages?: LightboxImages;
	nonRefreshableLineItemIds?: number[];
	pageId: string;
	publication: string;
	section: string;
	sectionName: string;
	series: string;
	seriesId: string;
	shouldHideReaderRevenue?: boolean;
	source: string;
	sponsorshipType: string;
	toneIds: string;
	tones: string;
	videoDuration: number;
	isbn?: string;
}

interface Ophan {
	setEventEmitter: unknown;
	trackComponentAttention: unknown;
	record: (...args: unknown[]) => void;
	viewId: unknown;
	pageViewId: string;
}

interface ImpressionsDfpObject {
	s: string; // Slot element ID
	ad: string; // Advertiser ID
	c: string; // Creative ID
	I: string; // Line item ID
	o: string; // Order ID
	A: string; // Ad unit name
	y: string; // Yield group ID (Exchange Bidder)
	co: string; // DFP Company ID (Exchange Bidder)
}

enum BlockingType {
	Manual = 1, // Deprecated
	Creative, // Creative-based detection
	ProviderSecurity, // Domain-based detection for unsafe domains
	BannedDomain, // Domain-based detection for banned domains
	ProviderIbv, // Domain-based detection for in-banner-video
	UnsafeJS, // JavaScript-based detection for unsafe ads
	Hrap, // Domain-based detection for high risk ad platform domains
}

type ConfiantCallback = (
	blockingType: BlockingType,
	blockingId: string,
	isBlocked: boolean,
	wrapperId: string,
	tagId: string,
	impressionsData?: {
		prebid?: {
			adId?: string | null;
			cpm?: number | null; // IN USD
			s?: string; // slot ID
		};
		dfp?: ImpressionsDfpObject;
	},
) => void;

interface Confiant extends Record<string, unknown> {
	settings: {
		callback: ConfiantCallback;
		[key: string]: unknown;
	};
}

// https://ams.amazon.com/webpublisher/uam/docs/web-integration-documentation/integration-guide/javascript-guide/api-reference.html#apstaginit
interface A9AdUnitInterface {
	slotID: string;
	slotName?: string;
	sizes: number[][];
}

type ApstagInitConfig = {
	pubID: string;
	adServer?: string;
	bidTimeout?: number;
};

type FetchBidsBidConfig = {
	slots: A9AdUnitInterface;
};

type Apstag = {
	init: (ApstagInitConfig) => void;
	fetchBids: (FetchBidsBidConfig, callback: () => void) => void;
	setDisplayBids: () => void;
};

type ComscoreGlobals = {
	c1: string;
	c2: string;
	cs_ucfr: string;
	comscorekw?: string;
};

type AdBlockers = {
	active: boolean | undefined;
	onDetect: function[];
};

/**
 *  All article history types here are duplicated from elsewhere.
 *  This is because adding imports to this file causes typechecking to break for every use of window.guardian in the codebase.
 */
type TagCounts = Record<string, number>;
type WeeklyArticleLog = {
	week: number;
	count: number;
	tags?: TagCounts;
};
type WeeklyArticleHistory = WeeklyArticleLog[];

interface DailyArticleCount {
	day: number;
	count: number;
}

type DailyArticleHistory = DailyArticleCount[];

interface ArticleCounts {
	weeklyArticleHistory: WeeklyArticleHistory;
	dailyArticleHistory: DailyArticleHistory;
}

interface IasPET {
	queue?: Array<{
		adSlots: IasPETSlot[];
		dataHandler: (targetingJSON: string) => void;
	}>;
	pubId?: string;
}

interface OptOutInitializeOptions {
	publisher: number;
	onlyNoConsent?: 0 | 1;
	alwaysNoConsent?: 0 | 1;
	consentTimeOutMS?: 5000;
	noLogging?: 0 | 1;
	lazyLoading?: { fractionInView?: number; viewPortMargin?: string };
}

interface OptOutResponse {
	adSlot: string;
	width: number;
	height: number;
	ad: string; // The creative HTML
	creativeId: string;
	meta: {
		networkId: string;
		networkName: string;
		agencyId: string;
		agencyName: string;
		advertiserId: string;
		advertiserName: string;
		advertiserDomains: string[];
	};
	optOutExt: {
		noSafeFrame: boolean;
		tags: string[];
	};
}

interface OptOutAdSlot {
	adSlot: string;
	targetId: string;
	id: string;
	filledCallback?: (adSlot: OptOutAdSlot, response: OptOutResponse) => void;
	emptyCallback?: (adSlot: OptOutAdSlot) => void;
	adShownCallback?: (adSlot: OptOutAdSlot, response: OptOutResponse) => void;
}

/**
 * Describes the configuration options for the Safeframe host API
 *
 * Currently typed as `unknown` since we do not consume it ourselves
 */
type SafeFrameAPIHostConfig = unknown;

/**
 * Types for the IAB Safeframe API
 *
 * Note this type definition is incomplete.
 * These types can be refined as/when they are required
 */
interface SafeFrameAPI {
	ver: string;
	specVersion: string;
	lib: {
		lang: Record<string, unknown>;
		dom: {
			iframes: Record<string, unknown>;
			msghost: Record<string, unknown>;
		};
		logger: Record<string, unknown>;
	};
	env: {
		isIE: boolean;
		ua: Record<string, unknown>;
	};
	info: {
		errs: unknown[];
		list: unknown[];
	};
	host: {
		Config: {
			new (o: {
				renderFile: string;
				positions: Record<string, unknown>;
			}): SafeFrameAPIHostConfig;
		};
	};
}

interface Window {
	// eslint-disable-next-line id-denylist -- this *is* the guardian object
	guardian: {
		ophan: Ophan;
		config: Config;
		queue: Array<() => Promise<void>>;
		mustardCut?: boolean;
		polyfilled?: boolean;
		adBlockers: AdBlockers;
		// /frontend/common/app/templates/inlineJS/blocking/enableStylesheets.scala.js
		css: { onLoad: () => void; loaded: boolean };
		articleCounts?: ArticleCounts;
		commercial?: {
			dfpEnv?: DfpEnv;
		};
	};
	ootag: {
		queue: Array<() => void>;
		initializeOo: (o: OptOutInitializeOptions) => void;
		addParameter: (key: string, value: string) => void;
		defineSlot: (o: OptOutAdSlot) => void;
		makeRequests: () => void;
		refreshSlot: (slotId: string) => void;
		refreshAllSlots: () => void;
	};
	confiant?: Confiant;
	apstag?: Apstag;
	_comscore?: ComscoreGlobals[];
	__iasPET?: IasPET;

	// https://www.iab.com/wp-content/uploads/2014/08/SafeFrames_v1.1_final.pdf
	$sf: SafeFrameAPI;

	// Safeframe API host config required by Opt Out tag
	conf: SafeFrameAPIHostConfig;
}
