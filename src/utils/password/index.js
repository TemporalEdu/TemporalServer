const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
	/**
	 * Hashes a password
	 * @param {string} password The password to hash
	 * @returns {string} The hashed password
	 * @throws {Error} If the password is not a string
	 */
	hash: async (password) => {
		// Check if the password is a string
		if (typeof password !== 'string') {
			throw new Error('Password must be a string');
		}

		// Hash the password
		let passwordHash = await bcrypt.hash(password, saltRounds);
		return passwordHash;
	},

	/**
	 * Compares a password to a hash
	 * @param {string} password The password to compare
	 * @param {string} hash The hash to compare to
	 * @returns {boolean} If the password matches the hash
	 * @throws {Error} If the password or hash is not a string
	 */

	compare: async (password, hash) => {
		// Check if the password is a string
		if (typeof password !== 'string') {
			throw new Error('Password must be a string');
		}

		// Check if the hash is a string
		if (typeof hash !== 'string') {
			throw new Error('Hash must be a string');
		}

		// Compare the password and hash
		let result = await bcrypt.compare(password, hash);
		return result;
	}
}