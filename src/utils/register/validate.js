const config = require('../../config/register.json');

// Validation functions for username, password, and email
const validate = {
	username: async (username) => {
		if (!username) {
			return {
				valid: false,
				message: 'Username is required.'
			};
		}
		if (username.length < config.username.min) {
			return {
				valid: false,
				message: `Username must be at least ${config.username.min} characters long.`
			}
		}
		if (username.length > config.username.max) {
			return {
				valid: false,
				message: `Username must be at most ${config.username.max} characters long.`
			}
		}
		if (new RegExp(config.username.regex).test(username) === false) {
			return {
				valid: false,
				message: `Username is invalid.`
			}
		}
		// Check if the username is taken
		// This is a database call
		const user = await global.database.user.get.by({ username: username });
		if (user) {
			return {
				valid: false,
				message: `Username is taken.`
			}
		}
		return {
			valid: true,
			message: `Username is valid.`
		}
	},
	password: (password) => {
		if (!password) {
			return {
				valid: false,
				message: 'Password is required.'
			};
		}
		if (password.length < config.password.min) {
			return {
				valid: false,
				message: `Password must be at least ${config.password.min} characters long.`
			}
		}
		if (password.length > config.password.max) {
			return {
				valid: false,
				message: `Password must be at most ${config.password.max} characters long.`
			}
		}
		if (new RegExp(config.password.regex).test(password) === false) {
			return {
				valid: false,
				message: `Password is invalid.`
			}
		}
		return {
			valid: true,
			message: `Password is valid.`
		}
	},
	email: async (email) => {
		if (!email) {
			return {
				valid: false,
				message: 'Email is required.'
			};
		}
		if (email.length < config.email.min) {
			return {
				valid: false,
				message: `Email must be at least ${config.email.min} characters long.`
			}
		}
		if (email.length > config.email.max) {
			return {
				valid: false,
				message: `Email must be at most ${config.email.max} characters long.`
			}
		}
		if (new RegExp(config.email.regex).test(email) === false) {
			return {
				valid: false,
				message: `Email is invalid.`
			}
		}
		// Search for the email in the database
		// This is a database call
		const user = await global.database.user.get.by({ email: email });
		if (user) {
			return {
				valid: false,
				message: `Email is taken.`
			}
		}
		return {
			valid: true,
			message: `Email is valid.`
		}
	}
}

module.exports = validate;