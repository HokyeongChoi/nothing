export const GA_TRACKING_ID = "UA-157887746-1";

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = url => {
  window.gtag("config", GA_TRACKING_ID, {
    page_path: url
  });
};
