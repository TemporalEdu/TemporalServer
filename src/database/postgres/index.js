// Main file for PostgreSQL database wrapper, it will export all necessary functions, schemas, and models for the server to use.

const pg = require('pg');

class PostgreSQLWrapper {
	constructor(host, user, password, database) {
		this.connection = null;
		this.host = host;
		this.user = user;
		this.password = password;
		this.database = database;
	}

	async connect() {
		try {
			// Connect to the database
			this.connection = new pg.Pool({
				host: this.host,
				user: this.user,
				password: this.password,
				database: this.database
			});

			// Log the connection
			global.logger.info("Connected to PostgreSQL database");
		} catch (err) {
			// Log the error
			global.logger.logRaw(err.stack);
			global.logger.fatal("Failed to connect to PostgreSQL database");
		}
	}
}

module.exports = PostgreSQLWrapper;