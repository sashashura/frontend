/**
 * DO NOT EDIT THIS FILE
 *
 * It is not used to to build anything.
 *
 * It's just a record of the old flow types.
 *
 * Use it as a guide when converting
 * - static/src/javascripts/lib/__mocks__/fastdom.js
 * to .ts, then delete it.
 */

// @flow

import promised from './fastdom-promise'

/* eslint-disable no-unused-vars */
export default {
    measure: (fn: Function, ctx: ?Object): number => fn(),
    mutate: (fn: Function, ctx: ?Object): number => fn(),
    clear: (id: number): void => {},
    extend: () => promised
};