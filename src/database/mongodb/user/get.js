const UserSchema = require('../schemas/user/User');

// This function gets a user from the database
// It returns the user object
module.exports = {
	by: (query) => {
		if (query.safe === true || query.safe === undefined || query.safe === null) {
			delete query.safe;
			return UserSchema.findOne(query).select('-passwordHash -createdAt -updatedAt -__v -_id');
		} else {
			delete query.safe;
			return UserSchema.findOne(query);
		}
	}
}