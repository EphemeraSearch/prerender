const util = require('../util.js');

const blockedResources = [
  'google-analytics.com',
  'api.mixpanel.com',
  'fonts.googleapis.com',
  'maps.googleapis.com',
  'rum.browser-intake-datadoghq.com',
  'stats.g.doubleclick.net',
  'mc.yandex.ru',
  'use.typekit.net',
  'beacon.tapfiliate.com',
  'js-agent.newrelic.com',
  'api.segment.io',
  'woopra.com',
  'static.olark.com',
  'static.getclicky.com',
  'fast.fonts.com',
  'youtube.com/embed',
  'cdn.heapanalytics.com',
  'googleads.g.doubleclick.net',
  'pagead2.googlesyndication.com',
  'fullstory.com/rec',
  'navilytics.com/nls_ajax.php',
  'log.optimizely.com/event',
  'hn.inspectlet.com',
  'tpc.googlesyndication.com',
  'partner.googleadservices.com',
  '.ttf',
  '.eot',
  '.otf',
  '.woff',
  // ".png",
  // ".gif",
  // ".tiff",
  '.pdf',
  // ".jpg",
  // ".jpeg",
  // ".ico",
  // ".svg"
];

module.exports = {
  tabCreated: (req, res, next) => {
    util.log('tabCreated: blockResources: url:', req.prerender.url);
    req.prerender.tab.Network.setRequestInterception({
      patterns: [{ urlPattern: '*' }],
    }).then(() => {
      next();
    });

    let firstTime = true;
    req.prerender.tab.Network.requestIntercepted(
      async ({ interceptionId, request, isNavigationRequest, ...rest }) => {
        util.log(
          `requestIntercepted: blockResources: url ${request.url}  interceptionId: ${interceptionId}`,
        );
        util.log('discarded:', rest);

        let shouldBlock = false;
        blockedResources.forEach((substring) => {
          if (request.url.indexOf(substring) >= 0) {
            util.error(`!! BLOCKED: ${request.url}`);
            shouldBlock = true;
          }
        });

        let interceptOptions = { interceptionId };

        if (shouldBlock) {
          interceptOptions.errorReason = 'Aborted';
        } else {
          interceptOptions.errorReason = firstTime ? undefined : 'Aborted';
        }

        if (isNavigationRequest) {
          util.log(
            'continueInterceptedRequest: blockResources: interceptOptions:',
            interceptOptions,
          );
          try {
            // https://github.com/cyrus-and/chrome-remote-interface/issues/351#issuecomment-415443568
            await req.prerender.tab.Network.continueInterceptedRequest(interceptOptions);
          } catch (err) {
            console.error(`ERROR: ${err}`);
          } finally {
            util.log('setting firstTime to false');
            firstTime = false;
          }
        } else {
          util.log('isNavigationRequest is false, doing nothing');
        }
      },
    );
  },
};
