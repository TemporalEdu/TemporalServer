// Main file for SQLite database wrapper, it will export all necessary functions, schemas, and models for the server to use.

const sqlite = require('sqlite3').verbose();
const { Database } = require('sqlite3');

class SQLiteWrapper {
	constructor(file) {
		this.connection = null;
		this.file = file;
	}

	async connect() {
		try {
			// Connect to the database
			this.connection = new Database(this.file);

			// Log the connection
			global.logger.info("SQLite database is ready");
		} catch (err) {
			// Log the error
			global.logger.logRaw(err.stack);
			global.logger.fatal("Failed to initialize SQLite database");
		}
	}
}

module.exports = SQLiteWrapper;