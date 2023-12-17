#!/usr/bin/env node
var prerender = require("./lib");
const chrome_shim = process.env["GOOGLE_CHROME_SHIM"];
console.log(`chrome_shim is ${chrome_shim}`);

var server = prerender({
  chromeLocation: chrome_shim,
  logRequests: true,
  captureConsoleLog: true,
  chromeFlags: [
    "--no-sandbox",
    "--headless",
    "--disable-gpu",
    "--remote-debugging-port=9222",
    "--hide-scrollbars",
  ],
});

server.use(prerender.sendPrerenderHeader());
server.use(prerender.browserForceRestart());
// server.use(prerender.blockResources());
server.use(prerender.addMetaTags());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());

server.start();
