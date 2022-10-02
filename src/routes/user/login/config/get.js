const config = require('../../../../config/login.json');

module.exports = {
	name: 'test',
	path: '/user/login/config/get',
	enabled: true,
	method: 'get',
	ratelimit: {
		// The maximum number of requests that can be made in the time window
		max: 10,
		// The time window in milliseconds
		window: 1000
	},
	handler: async (req, res) => {
		// Send the config to the client
		return res.status(200).send(config);
	}
}