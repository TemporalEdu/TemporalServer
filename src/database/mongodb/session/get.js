const SessionSchema = require('../schemas/session/Session');

// This function gets a user from the database
// It returns the user object
module.exports = {
	by: (query) => {
		return SessionSchema.findOne(query);
	}
}