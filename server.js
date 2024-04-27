#!/usr/bin/env node
var prerender = require('./lib');
const util = require('./lib/util');

var server = prerender({
  // chromeLocation: chrome_path,
  logRequests: true,
  captureConsoleLog: true,
  chromeFlags: [
    '--no-sandbox',
    '--headless',
    '--disable-gpu',
    '--remote-debugging-port=9222',
    '--hide-scrollbars',
    '--remote-debugging-address=::1',
  ],
  pageLoadTimeout: Number(process.env['PAGE_LOAD_TIMEOUT']) || 40 * 1000,
});

server.use(prerender.sendPrerenderHeader());
server.use(prerender.browserForceRestart());
server.use(prerender.blockResources());
server.use(prerender.forceCacheRefresh());
server.use(prerender.addMetaTags());
server.use(prerender.removeScriptTags());
server.use(prerender.httpHeaders());
// server.use(prerender.basicAuth());

const defaultTtlInSec = 60 * 60 * 24 * 3; // 3 days
server.options.ttl = 1000 * Number(process.env['CACHE_TTL'] || defaultTtlInSec); // Must come before `server.use(require("prerender-level-cache"))`
server.use(require('./lib/plugins/levelCache/levelCache'));
util.log('[server] server.options.ttl', server.options.ttl);

server.start();
