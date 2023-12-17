#!/usr/bin/env node
var prerender = require("./lib");
const chrome_bin = process.env["GOOGLE_CHROME_BIN"];
const chrome_shim = process.env["GOOGLE_CHROME_SHIM"];
const chrome_path = "/app/.apt/usr/bin/google-chrome";
console.log(`chrome_shim is ${chrome_shim}`);
console.log(`chrome_bin is ${chrome_bin}`);
console.log(`chrome_path is ${chrome_path}`);

var server = prerender({
  chromeLocation: chrome_path,
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

server.start();
