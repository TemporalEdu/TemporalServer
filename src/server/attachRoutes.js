const chalk = require('chalk');

module.exports = function (expressServer, routesObject) {
	// Set up a ratelimits object
	const ratelimits = {};
	// Attach all routes from the routesObject to the express server
	for (const route of routesObject) {
		// Add the route to the rate limits object
		ratelimits[route.path] = {};
		// Check if the route is enabled
		if (route.enabled) {
			// Get the method
			const method = route.method.toLowerCase();
			// Build the route
			expressServer[method](route.path, async (req, res) => {
				try {
					// Check if the route has a ratelimit
					if (route.ratelimit) {
						// Get the max and window from the ratelimit
						const {max, window} = route.ratelimit;
						// Get the IP address of the request
						const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
						// Check if the IP address is in the ratelimits object
						if (ratelimits[route.path][ip]) {
							// Check if the number of requests is greater than the max
							if (ratelimits[route.path][ip].requests > max) {
								// Check if the time since the last request is greater than the window
								if (Date.now() - ratelimits[route.path][ip].lastRequest > window) {
									// Reset the ratelimit
									ratelimits[route.path][ip] = {
										requests: 0,
										lastRequest: Date.now()
									};
								} else {
									global.logger.warn(`${req.method} ${req.path} ${req.ip} 429`);
									// Send a 429 Too Many Requests error
									return res.status(429).send({
										error: 'Too many requests',
										status: 429,
										message: 'You have made too many requests. Please try again later.'
									});
								}
							}
						} else {
							// Add the IP address to the object of the path
							ratelimits[route.path][ip] = {
								requests: 0,
								lastRequest: Date.now()
							}
						}
						// Increment the number of requests
						ratelimits[route.path][ip].requests++;
						// Set the last request time
						ratelimits[route.path][ip].lastRequest = Date.now();
					}
					if (route.access) {
						// Check if the route requires the user to be signed in
						if (route.access.signedIn) {
							// Use our auth middleware to check if the user is signed in
							if (!req.signedIn) {
								console.log(req.signedIn);
								// Send a 401 Unauthorized error
								global.logger.warn(`${req.method} ${req.path} ${req.ip} 401`);
								return res.status(401).send({
									error: 'Unauthorized',
									status: 401,
									message: 'You are not authorized to access this resource.'
								});
							}
						}
					}
					// Run the route handler
					await route.handler(req, res);
					if (res.statusCode > 199 && res.statusCode < 300) {
						global.logger.info(`${req.method} ${req.path} ${req.ip} ${res.statusCode}`);
					}
					if (res.statusCode > 299 && res.statusCode < 400) {
						global.logger.info(`${req.method} ${req.path} ${req.ip} ${res.statusCode}`);
					}
					if (res.statusCode > 399 && res.statusCode < 500) {
						global.logger.warn(`${req.method} ${req.path} ${req.ip} ${res.statusCode}`);
					}
					if (res.statusCode > 499) {
						global.logger.error(`${req.method} ${req.path} ${req.ip} ${res.statusCode}`);
					}
				} catch (err) {
					// Send a 500 Internal Server Error
					global.logger.error(`${req.method} ${req.path} ${req.ip} 500`);
					global.logger.logRaw(err.stack);
					return res.status(500).send({
						error: 'Internal Server Error',
						status: 500,
						message: 'An internal server error has occurred. Please try again later.'
					});
					// Log the error
				}
			});
			global.logger.info("Attached route " + route.path + " (" + route.method + ")");
		}
	}
	// Set up a 404 handler
	expressServer.use((req, res) => {
		// Since Express keeps glitching and sends 404s when it shouldn't, we'll check if the route exists
		let found = false;
		for (const route of routesObject) {
			if (route.path === req.path) {
				found = true;
				break;
			}
		}
		if (!found) {
			// Send a 404 Not Found error
			global.logger.warn(`${req.method} ${req.path} ${req.ip} 404`);
			return res.status(404).send({
				error: 'Not Found',
				status: 404,
				message: 'The requested resource could not be found.'
			});
		}
	});
}