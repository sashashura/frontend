/**
 * DO NOT EDIT THIS FILE
 *
 * It is not used to to build anything.
 *
 * It's just a record of the old flow types.
 *
 * Use it as a guide when converting
 * - static/src/javascripts/projects/common/modules/identity/email-sign-in-banner/campaigns.js
 * to .ts, then delete it.
 */

// @flow
type Campaign = {
    name: string,
    utm: string,
};

const campaigns: Campaign[] = [
    {
        name: 'Guardian Today UK',
        utm: 'GU Today main NEW H categories',
    },
    {
        name: 'Test Campaign',
        utm: 'test1212',
    },
];

const getEmailCampaignFromUtm = (utm: string): ?Campaign =>
    campaigns.find((campaign: Campaign) => campaign.utm === utm);

const getEmailCampaignFromUrl = (): ?Campaign => {
    const emailCampaignInUrl = (new window.URLSearchParams(
        window.location.search
    ).getAll('utm_campaign') || [''])[0];
    return getEmailCampaignFromUtm(emailCampaignInUrl);
};

export type { Campaign };
export { campaigns, getEmailCampaignFromUtm, getEmailCampaignFromUrl };