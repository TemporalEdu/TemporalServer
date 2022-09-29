const package = require('../../../package.json');

module.exports = {
	name: 'test',
	path: '/test/',
	enabled: true,
	method: 'get',
	ratelimit: {
		// The maximum number of requests that can be made in the time window
		max: 3,
		// The time window in milliseconds
		window: 5000
	},
	handler: async (req, res) => {
		return res.status(201).send({
			"server": "TemporalServer",
			"version": package.version,
			"status": "online",
			"message": "Hello world!"
		});
	}
}