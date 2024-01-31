#!/usr/bin/env node
var prerender = require("./lib");

var server = prerender({
  // chromeLocation: chrome_path,
  logRequests: true,
  captureConsoleLog: true,
  chromeFlags: [
    "--no-sandbox",
    "--headless",
    "--disable-gpu",
    "--remote-debugging-port=9222",
    "--hide-scrollbars",
  ],
  pageLoadTimeout: 40 * 1000,
});

server.use(prerender.sendPrerenderHeader());
server.use(prerender.browserForceRestart());
// server.use(prerender.blockResources());
server.use(prerender.addMetaTags());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());
server.options.ttl = process.env["CACHE_TTL"] || 60 * 60 * 24 * 3; // 3 days
console.log("server.options.ttl", server.options.ttl);
server.use(require("prerender-level-cache"));

server.start();
