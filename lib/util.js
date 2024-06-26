const url = require('url');

const util = exports = module.exports = {};

// Normalizes unimportant differences in URLs - e.g. ensures
// http://google.com/ and http://google.com normalize to the same string
util.normalizeUrl = function(u) {
	return url.format(url.parse(u, true));
};

util.getOptions = function(req) {

	var requestedUrl = req.url;

	//new API starts with render so we'll parse the URL differently if found
	if(requestedUrl.indexOf('/render') === 0) {

		let optionsObj = {};
		if(req.method === 'GET') {
			optionsObj = url.parse(requestedUrl, true).query;
		} else if (req.method === 'POST') {
			optionsObj = req.body;
		}

		return {
			url: util.getUrl(optionsObj.url),
			renderType: optionsObj.renderType || 'html',
			userAgent: optionsObj.userAgent,
			fullpage: optionsObj.fullpage || false,
			width: optionsObj.width,
			height: optionsObj.height,
			followRedirects: optionsObj.followRedirects,
			javascript: optionsObj.javascript
		}

	} else {

		return {
			url: util.getUrl(requestedUrl),
			renderType: 'html'
		}
	}
}

// Gets the URL to prerender from a request, stripping out unnecessary parts
util.getUrl = function(requestedUrl) {
	var decodedUrl, realUrl = requestedUrl,
		parts;

	if (!requestedUrl) {
		return '';
	}

	realUrl = realUrl.replace(/^\//, '');

	try {
		decodedUrl = decodeURIComponent(realUrl);
	} catch (e) {
		decodedUrl = realUrl;
	}

	//encode a # for a non #! URL so that we access it correctly
	decodedUrl = this.encodeHash(decodedUrl);

	//if decoded url has two query params from a decoded escaped fragment for hashbang URLs
	if (decodedUrl.indexOf('?') !== decodedUrl.lastIndexOf('?')) {
		decodedUrl = decodedUrl.substr(0, decodedUrl.lastIndexOf('?')) + '&' + decodedUrl.substr(decodedUrl.lastIndexOf('?') + 1);
	}

	parts = url.parse(decodedUrl, true);

	// Remove the _escaped_fragment_ query parameter
	if (parts.query && parts.query['_escaped_fragment_'] !== undefined) {

		if (parts.query['_escaped_fragment_'] && !Array.isArray(parts.query['_escaped_fragment_'])) {
			parts.hash = '#!' + parts.query['_escaped_fragment_'];
		}

		delete parts.query['_escaped_fragment_'];
		delete parts.search;
	}

	// Bing was seen accessing a URL like /?&_escaped_fragment_=
	delete parts.query[''];

	var newUrl = url.format(parts);

	//url.format encodes spaces but not arabic characters. decode it here so we can encode it all correctly later
	try {
		newUrl = decodeURIComponent(newUrl);
	} catch (e) {}

	newUrl = this.encodeHash(newUrl);

	return newUrl;
};

util.encodeHash = function(url) {
	if (url.indexOf('#!') === -1 && url.indexOf('#') >= 0) {
		url = url.replace(/#/g, '%23');
	}

	return url;
}

util.log = function() {
	if (process.env.DISABLE_LOGGING) {
		return;
	}
	if (!['DEBUG', 'INFO'].includes(process.env.LOG_LEVEL)) {
		console.log('no info log');
		return;
	}
	console.log.apply(console.log, ['[INFO]', new Date().toISOString()].concat(Array.prototype.slice.call(arguments, 0)));
};

util.debug = function() {
	if (process.env.DISABLE_LOGGING) {
		return;
	}
	if (!['DEBUG'].includes(process.env.LOG_LEVEL)) {
		console.log('no debug');
		return;
	}
	console.debug.apply(console.log, ['[DEBUG]', new Date().toISOString()].concat(Array.prototype.slice.call(arguments, 0)));
};

util.warn = function() {
	if (!['DEBUG', 'INFO', 'WARN'].includes(process.env.LOG_LEVEL)) {
		console.log('no warn');
		return;
	}
	console.warn.apply(console.warn, ['[WARN]', new Date().toISOString()].concat(Array.prototype.slice.call(arguments, 0)));
};

util.error = function() {
	if (!['DEBUG', 'INFO', 'WARN', 'ERROR'].includes(process.env.LOG_LEVEL)) {
		console.log('no error');
		return;
	}
	console.error.apply(console.error, ['[ERROR]', new Date().toISOString()].concat(Array.prototype.slice.call(arguments, 0)));
};
