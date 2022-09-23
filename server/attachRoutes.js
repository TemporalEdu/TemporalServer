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
									console.log(chalk.yellow(`[WARN] ${req.method} ${req.path} ${req.ip} 429`))
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
					// Run the route handler
					await route.handler(req, res);
					console.log(chalk.blue(`[INFO] ${req.method} ${req.path} ${req.ip} ${res.statusCode}`));
				} catch (err) {
					// Send a 500 Internal Server Error
					console.log(chalk.red(`[ERROR] ${req.method} ${req.path} ${req.ip} 500`));
					return res.status(500).send({
						error: 'Internal Server Error',
						status: 500,
						message: 'An internal server error has occurred. Please try again later.'
					});
					// Log the error
					console.error(err);
				}
			});
		}
	}
}