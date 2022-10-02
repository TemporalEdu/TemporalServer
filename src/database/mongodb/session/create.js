const SessionSchema = require('../schemas/session/Session');
const UserSchema = require('../schemas/user/User');
const UUID = require('../../../utils/uuid/index');

// This function creates a session in the database
// It returns the session object
module.exports = async (username, jwt) => {
	// Get the user
	const user = await UserSchema.findOne({ username: username });

	// Create the session object
	const session = {
		user: user._id,
		jwt: jwt
	};

	// Create the session in the database
	return SessionSchema.create(session);
}