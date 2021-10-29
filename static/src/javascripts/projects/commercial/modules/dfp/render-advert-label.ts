/* eslint-disable @typescript-eslint/no-misused-promises
-- Fastdom measure and mutate signatures are Promise<void>
-- Nested fastdom measure-mutate promises throw the error:
-- "Promise returned in function argument where a void return was expected"
*/
import crossIcon from 'svgs/icon/cross.svg';
import fastdom from '../../../../lib/fastdom-promise';

const shouldRenderLabel = (adSlotNode: HTMLElement) =>
	// adSlotNode.classList.contains('ad-slot--fluid') ||
	!(
		adSlotNode.classList.contains('ad-slot--frame') ||
		adSlotNode.classList.contains('ad-slot--gc') ||
		adSlotNode.classList.contains('u-h') ||
		// set for out-of-page (1x1) and empty (2x2) ads
		adSlotNode.classList.contains('ad-slot--collapse') ||
		adSlotNode.getAttribute('data-label') === 'false' ||
		adSlotNode.getElementsByClassName('ad-slot__label').length
	);

const createAdCloseDiv = () => {
	const closeDiv: HTMLElement = document.createElement('button');
	closeDiv.className = 'ad-slot__close-button';
	closeDiv.innerHTML = crossIcon.markup;
	closeDiv.onclick = () => {
		const container: HTMLElement | null = closeDiv.closest(
			'.mobilesticky-container',
		);
		if (container) container.remove();
	};
	return closeDiv;
};

/**
 * @param {HTMLElement} adSlotNode
 */
export const renderAdvertLabel = (
	adSlotNode: HTMLElement,
): Promise<Promise<void>> => {
	return fastdom.measure(() => {
		if (shouldRenderLabel(adSlotNode)) {
			return fastdom.mutate(() => {
				adSlotNode.setAttribute('data-label-show', 'true');
			});
		}
		return Promise.resolve();
	});
};

export const renderStickyAdLabel = (adSlotNode: HTMLElement): Promise<void> =>
	fastdom.measure(() => {
		const adSlotLabel: HTMLElement = document.createElement('div');
		adSlotLabel.classList.add('ad-slot__label');
		adSlotLabel.classList.add('sticky');
		adSlotLabel.innerHTML = 'Advertisement';
		adSlotNode.appendChild(adSlotLabel);
	});

export const renderStickyScrollForMoreLabel = (
	adSlotNode: HTMLElement,
): Promise<void> =>
	fastdom.mutate(() => {
		const scrollForMoreLabel = document.createElement('div');
		scrollForMoreLabel.classList.add('ad-slot__scroll');
		scrollForMoreLabel.innerHTML = 'Scroll for More';
		scrollForMoreLabel.onclick = (event) => {
			adSlotNode.scrollIntoView({
				behavior: 'smooth',
				block: 'start',
			});
			event.preventDefault();
		};
		adSlotNode.appendChild(scrollForMoreLabel);
	});
