const jwt = require('jsonwebtoken');

module.exports = async (req, res, next) => {
	const authorization = req.headers.authorization;
	if (authorization) {
		const token = authorization.split(' ')[1];
		if (token) {
			jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
				if (err) {
					req.signedIn = false;
					req.user = null;
					return next();
				}
				// Try to fetch the session from the database
				global.database.session.get.by({
					jwt: token,
				}).then((session) => {
					// If the session doesn't exist, send an error
					if (!session) {
						req.signedIn = false;
						req.user = null;
						return next();
					} else {
						// If the session does exist, set the user
						req.signedIn = true;
						req.user = user;
						return next();
					}
				}).catch((err) => {
					req.signedIn = false;
					req.user = null;
					return next();
				});
			});
		} else {
			req.signedIn = false;
			req.user = null;
			return next();
		}
	} else {
		req.signedIn = false;
		req.user = null;
		return next();
	}
};