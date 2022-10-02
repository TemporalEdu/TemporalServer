const validate = require('../../../utils/register/validate');
const PasswordLib = require('../../../utils/password/index');
const jwt = require('jsonwebtoken');

module.exports = {
	name: 'login',
	path: '/user/login',
	enabled: true,
	method: 'post',
	ratelimit: {
		// The maximum number of requests that can be made in the time window
		max: 5,
		// The time window in milliseconds
		window: 5000
	},
	handler: async (req, res) => {
		// Validate the request
		let problems = {};
		// Validate the username
		const usernameValidation = await validate.username(req.body.username);
		if (!req.body.username) {
			problems.username = 'Username is required';
		}
		// Validate the password
		const passwordValidation = validate.password(req.body.password);
		if (!req.body.password) {
			problems.password = 'Password is required';
		}
		// If there are any problems, send them to the client'
		if (Object.keys(problems).length > 0) {
			return res.status(400).send({
				success: false,
				message: 'Please fix the problems below.',
				problems: problems
			});
		}
		// Get the user from the database (global)
		const user = await global.database.user.get.by({
			username: req.body.username,
			safe: false,
		})
		// If the user doesn't exist, send an error
		if (user === null) {
			return res.status(401).send({
				success: false,
				message: 'Invalid username or password.'
			});
		}
		// Compare the password
		const passwordMatch = await PasswordLib.compare(req.body.password, user.passwordHash);
		// If the password doesn't match, send an error
		if (passwordMatch === false) {
			return res.status(401).send({
				success: false,
				message: 'Invalid username or password.'
			});
		}
		// Create a JWT token
		const token = jwt.sign({
			username: user.username,
		}, process.env.JWT_SECRET, {
			expiresIn: global.config.jwt.expiresIn
		});
		// Create a session for the user
		const session = await global.database.session.create(user.username, token);
		// Send the token to the client
		return res.status(200).send({
			success: true,
			message: 'Login successful.',
			token: token
		});
	}
}