#!/usr/bin/env node
var prerender = require('./lib');
const util = require('./lib/util');

var server = prerender({
  captureConsoleLog: true,
  logRequests: true,
  pageLoadTimeout: Number(process.env['PAGE_LOAD_TIMEOUT']) || 40 * 1000,
  // note: providing chromeFlags will override the default prerender chromeFlags.
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
