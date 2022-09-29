const package = require('../../../package.json');

module.exports = {
	name: 'error',
	path: '/test/error',
	enabled: true,
	method: 'get',
	ratelimit: {
		// The maximum number of requests that can be made in the time window
		max: 100,
		// The time window in milliseconds
		window: 5000
	},
	handler: async (req, res) => {
		throw new Error('This is an error');
	}
}