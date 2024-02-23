const util = require('../util.js');

module.exports = {
  init: () => util.log("using force cache refresh plugin"),

  requestReceived: (req, res, next) => {
    util.log("[forceCacheRefresh] req.url", req.url);
    util.log("[forceCacheRefresh] req.prerender.url", req?.prerender?.url);
    util.log("[forceCacheRefresh] req.prerender", req?.prerender);
    const query = new URLSearchParams(req.prerender.url.split("?")[1]);
    util.log("[forceCacheRefresh] query", query);
    if (query.get("__refresh") === "true") {
      util.warn("[forceCacheRefresh] forcing cache refresh due to __refresh url param");
      req.refresh = true;
    }
    next();
  },
};
