/**
 * DO NOT EDIT THIS FILE
 *
 * It is not used to to build anything.
 *
 * It's just a record of the old flow types.
 *
 * Use it as a guide when converting
 * - static/src/javascripts/projects/commercial/modules/third-party-tags/imr-worldwide-legacy.js
 * to .ts, then delete it.
 */

// @flow
import config from 'lib/config';
import { isInAuOrNz } from 'common/modules/commercial/geo-utils';

// nol_t is a global function defined by the IMR worldwide library
// eslint-disable-next-line camelcase
declare var nol_t: (config: any) => any;

const onLoad = () => {
    const pvar = {
        cid: 'au-guardian',
        content: '0',
        server: 'secure-gl',
    };

    const trac = nol_t(pvar);
    trac.record().post();
};

export const imrWorldwideLegacy: ThirdPartyTag = {
    shouldRun: config.get('switches.imrWorldwide') && isInAuOrNz(),
    url: '//secure-au.imrworldwide.com/v60.js',
    onLoad,
};