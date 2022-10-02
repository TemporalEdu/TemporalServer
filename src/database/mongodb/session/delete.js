const UserSchema = require('../schemas/user/User');
const SessionSchema = require('../schemas/session/Session');

// This function deletes a session from the database
module.exports = {
	by: async (query) => {
		// Delete the session
		await SessionSchema.deleteOne(query);
		return;
	}
}