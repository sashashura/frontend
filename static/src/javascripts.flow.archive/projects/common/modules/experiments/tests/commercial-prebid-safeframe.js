/**
 * DO NOT EDIT THIS FILE
 *
 * It is not used to to build anything.
 *
 * It's just a record of the old flow types.
 *
 * Use it as a guide when converting
 * - static/src/javascripts/projects/common/modules/experiments/tests/commercial-prebid-safeframe.js
 * to .ts, then delete it.
 */

// @flow

export const commercialPrebidSafeframe: ABTest = {
    id: 'CommercialPrebidSafeframe',
    start: '2018-06-29',
    expiry: '2019-10-18',
    author: 'Jerome Eteve',
    description: 'This test will serve prebid ads via safeframe line items',
    audience: 0.01,
    audienceOffset: 0,
    successMeasure: 'Measurement of prebid ads yield',
    audienceCriteria: 'n/a',
    dataLinkNames: 'n/a',
    idealOutcome: 'No difference between safeframe and standard',
    showForSensitive: false,
    canRun: () => true,
    variants: [
        {
            id: 'control',
            test: (): void => {},
        },
        {
            id: 'variant',
            test: (): void => {},
        },
    ],
};
