module.exports = {
  init: () => console.log("using force cache refresh plugin"),

  requestReceived: (req, res, next) => {
    console.log("req.url", req.url);
    console.log("req.prerender.url", req?.prerender?.url);
    const query = new URLSearchParams(req.prerender.url.split("?")[1]);
    console.log("query", query);
    if (query.get("__refresh") === "true") {
      console.log("refreshing cache");
      req.refresh = true;
    }
    next();
  },
};
