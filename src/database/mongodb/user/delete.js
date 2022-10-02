const UserSchema = require('../schemas/user/User');

// This function deletes a user from the database
module.exports = {
	by: (query) => {
		return UserSchema.deleteOne(query);
	}
}