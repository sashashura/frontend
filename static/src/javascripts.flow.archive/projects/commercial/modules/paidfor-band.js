/**
 * DO NOT EDIT THIS FILE
 *
 * It is not used to to build anything.
 *
 * It's just a record of the old flow types.
 *
 * Use it as a guide when converting
 * - static/src/javascripts/projects/commercial/modules/paidfor-band.js
 * to .ts, then delete it.
 */

// @flow

import { Sticky } from 'common/modules/ui/sticky';
import { commercialFeatures } from 'common/modules/commercial/commercial-features';

export const init = (): Promise<boolean> => {
    if (!commercialFeatures.paidforBand) {
        return Promise.resolve(false);
    }

    const elem = document.querySelector('.paidfor-band');
    if (elem) {
        new Sticky(elem).init();
    }

    return Promise.resolve(true);
};
