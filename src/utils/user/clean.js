/**
 * Clean up user data
 * @param user The user object to clean up
 * @returns The cleaned up user object
 */
const clean = (user) => {
	delete user.passwordHash;
	delete user.createdAt;
	delete user.updatedAt;
	delete user.__v;
	delete user._id;
	return user;
}

module.exports = clean;