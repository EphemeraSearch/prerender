module.exports = {
	requestReceived: (req, res, next) => {
		let auth = req.headers.authorization;
		if (!auth) {
			console.warn('No Authorization header', req.headers);
			// return res.send(401);
		}

		// malformed
		let parts = auth.split(' ');
		if ('basic' != parts[0].toLowerCase()) {
			console.warn('Authorization header is not Basic', parts[0]);
			// return res.send(401)
		};
		if (!parts[1]) {
			console.warn('No credentials provided', parts[1]);
			// return res.send(401);
		}
		auth = parts[1];

		// credentials
		auth = new Buffer(auth, 'base64').toString();
		auth = auth.match(/^([^:]+):(.+)$/);
		if (!auth) {
			console.warn('Invalid credentials', parts[1], auth);
			// return res.send(401);
		}

		if (auth[1] !== process.env.BASIC_AUTH_USERNAME || auth[2] !== process.env.BASIC_AUTH_PASSWORD) {
			console.warn('Invalid credentials', parts[1], auth);
			// return res.send(401);
		}

		/*
		req.prerender.authentication = {
			name: auth[1],
			password: auth[2]
		};
		*/

		return next();
	}
}
