const util = require('../util.js');

const blockedResources = [
  '.gif',
  '.ico',
  '.jpeg',
  '.jpg',
  '.png',
  '.svg',
  '.tiff',
  '.eot',
  '.otf',
  '.pdf',
  '.ttf',
  '.woff',
  'api.mixpanel.com',
  'api.segment.io',
  'beacon.tapfiliate.com',
  'cdn.heapanalytics.com',
  'datadoghq-browser-agent.com',
  'ephemerasearch.com/api/users/current/',
  'fast.fonts.com',
  'fonts.googleapis.com',
  'fullstory.com/rec',
  'google-analytics.com',
  'googleads.g.doubleclick.net',
  'hn.inspectlet.com',
  'imagedelivery.net',
  'js-agent.newrelic.com',
  'log.optimizely.com/event',
  'maps.googleapis.com',
  'mc.yandex.ru',
  'navilytics.com/nls_ajax.php',
  'pagead2.googlesyndication.com',
  'partner.googleadservices.com',
  'rum.browser-intake-datadoghq.com',
  'static.cloudflareinsights.com',
  'static.getclicky.com',
  'static.olark.com',
  'stats.g.doubleclick.net',
  'tpc.googlesyndication.com',
  'use.typekit.net',
  'woopra.com',
  'youtube.com/embed',
];
module.exports = {
  tabCreated: async (req, res, next) => {
    // Assuming async is intended for top-level middleware function
    util.log('tabCreated: blockResources: url:', req.prerender.url.slice(0, 50));
    await req.prerender.tab.Network.setRequestInterception({
      patterns: [{ urlPattern: '*' }],
    });
    next();

    req.prerender.tab.Network.requestIntercepted(
      async ({ interceptionId, request, isNavigationRequest, ...rest }) => {
        // util.log('discarded:', rest);
        if (isNavigationRequest) {
          debugger;
        }

        let shouldBlock = false;
        const shortUrl = request.url.slice(0, 50);
        blockedResources.forEach((substring) => {
          if (request.url.includes(substring)) {
            util.error(`!! BLOCKED: ${shortUrl} contains ${substring}`);
            shouldBlock = true;
          }
        });

        const interceptOptions = {
          interceptionId,
          errorReason: shouldBlock ? 'Aborted' : undefined,
        };

        // util.log(
        // `requestIntercepted: blockResources: interceptionId: ${interceptionId}  url ${shortUrl}`,
        // );
        util.log(
          `isNavigationRequest: ${isNavigationRequest}, shouldBlock: ${shouldBlock}, interceptionId: ${interceptionId}, url: ${shortUrl}`,
        );
        // util.log('continueInterceptedRequest: blockResources: interceptOptions:', interceptOptions);
        try {
          // https://github.com/cyrus-and/chrome-remote-interface/issues/351#issuecomment-415443568
          await req.prerender.tab.Network.continueInterceptedRequest(interceptOptions);
        } catch (err) {
          console.error(`ERROR: ${err}`);
        }
      },
    );
  },
};
