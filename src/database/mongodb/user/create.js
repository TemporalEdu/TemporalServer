const UserSchema = require('../schemas/user/User');
const PasswordLib = require('../../../utils/password/index');
const UUID = require('../../../utils/uuid/index');

// This function creates a user in the database
// It returns the user object
module.exports = async (username, password, email) => {
	// Create the user object
	const user = {
		username: username,
		passwordHash: await PasswordLib.hash(password),
		email: email
	};

	// Create the user in the database
	return UserSchema.create(user);
}