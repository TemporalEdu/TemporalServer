const validate = require('../../../utils/register/validate');
const jwt = require("jsonwebtoken");

module.exports = {
	name: 'register',
	path: '/user/register',
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
		if (usernameValidation.valid === false) {
			problems.username = usernameValidation.message;
		}
		// Validate the password
		const passwordValidation = validate.password(req.body.password);
		if (passwordValidation.valid === false) {
			problems.password = passwordValidation.message;
		}
		// Validate the email
		const emailValidation = await validate.email(req.body.email);
		if (emailValidation.valid === false) {
			problems.email = emailValidation.message;
		}
		// If there are any problems, send them to the client
		if (Object.keys(problems).length > 0) {
			return res.status(400).send({
				success: false,
				message: 'Please fix the problems below.',
				problems: problems
			});
		}
		// Create the user in the database (global)
		// This is the last time we'll see the password in plain text (it will be hashed)
		const user = await global.database.user.create(req.body.username, req.body.password, req.body.email);
		// Create a JWT token
		const token = jwt.sign({
			username: user.username,
		}, process.env.JWT_SECRET, {
			expiresIn: global.config.jwt.expiresIn
		});
		// Create a session for the user
		const session = await global.database.session.create(user.username, token);
		// Send the token to the client
		res.status(201).send({
			success: true,
			message: 'You have successfully registered.',
			token: token
		});
	}
}