const validate = require('../../../utils/register/validate');
const PasswordLib = require('../../../utils/password/index');
const jwt = require('jsonwebtoken');

module.exports = {
	name: 'logout',
	path: '/user/logout',
	enabled: true,
	method: 'post',
	ratelimit: {
		// The maximum number of requests that can be made in the time window
		max: 5,
		// The time window in milliseconds
		window: 5000
	},
	access: {
		signedIn: true
	},
	handler: async (req, res) => {
		// Given a JWT token, invalidate it
		let token = req.body.token;
		// If the token is not provided, send an error
		if (!token) {
			return res.status(400).send({
				success: false,
				message: 'Token is required.'
			});
		}
		// Invalidate the token
		await global.database.session.delete.by({
			jwt: token
		});
		// Send a success message
		return res.status(200).send({
			success: true,
			message: 'Token invalidated.'
		});
	}
}