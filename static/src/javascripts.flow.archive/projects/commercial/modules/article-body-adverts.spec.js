/**
 * DO NOT EDIT THIS FILE
 *
 * It is not used to to build anything.
 *
 * It's just a record of the old flow types.
 *
 * Use it as a guide when converting
 * - static/src/javascripts/projects/commercial/modules/article-body-adverts.spec.js
 * to .ts, then delete it.
 */

// @flow
import { init } from 'commercial/modules/article-body-adverts';
import config from 'lib/config';
import { spaceFiller } from 'common/modules/article/space-filler';
import { commercialFeatures } from 'common/modules/commercial/commercial-features';
import {
    getViewport as getViewport_,
    getBreakpoint as getBreakpoint_,
    isBreakpoint as isBreakpoint_,
} from 'lib/detect';

const getViewport: any = getViewport_;
const getBreakpoint: any = getBreakpoint_;
const isBreakpoint: any = isBreakpoint_;

jest.mock('commercial/modules/dfp/track-ad-render', () => (id: string) => {
    const ads = {
        'dfp-ad--im': true,
    };
    return Promise.resolve(ads[id]);
});
jest.mock('commercial/modules/dfp/add-slot', () => ({
    addSlot: jest.fn(),
}));
jest.mock('common/modules/commercial/commercial-features', () => ({
    commercialFeatures: {},
}));
jest.mock('common/modules/article/space-filler', () => ({
    spaceFiller: {
        fillSpace: jest.fn(),
    },
}));
jest.mock('lib/detect', () => ({
    isBreakpoint: jest.fn(),
    getBreakpoint: jest.fn(),
    getViewport: jest.fn(),
}));
jest.mock('lib/config', () => ({ page: {}, get: () => false }));
jest.mock('common/modules/experiments/ab', () => ({
    isInVariantSynchronous: () => false,
}));

const spaceFillerStub: JestMockFn<*, *> = (spaceFiller.fillSpace: any);

describe('Article Body Adverts', () => {
    beforeEach(() => {
        jest.resetAllMocks();
        commercialFeatures.articleBodyAdverts = true;
        spaceFillerStub.mockImplementation(() => Promise.resolve(2));
        getViewport.mockReturnValue({ height: 1300 });
        expect.hasAssertions();
    });

    it('should exist', () => {
        expect(init).toBeDefined();
    });

    it('should exit if commercial feature disabled', () => {
        commercialFeatures.articleBodyAdverts = false;
        return init().then(() => {
            expect(spaceFillerStub).not.toHaveBeenCalled();
        });
    });

    describe('When merchandising components enabled', () => {
        beforeEach(() => {
            getBreakpoint.mockReturnValue('mobile');
            isBreakpoint.mockReturnValue(true);
            config.page.hasInlineMerchandise = true;
        });
    });
});
