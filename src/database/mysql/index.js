// Main file for MySQL database wrapper, it will export all necessary functions, schemas, and models for the server to use.

const mysql = require('mysql');

class MySQLWrapper {
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
			this.connection = mysql.createConnection({
				host: this.host,
				user: this.user,
				password: this.password,
				database: this.database
			});

			// Log the connection
			global.logger.info("Connected to MySQL database");
		} catch (err) {
			// Log the error
			global.logger.logRaw(err.stack);
			global.logger.fatal("Failed to connect to MySQL database");
		}
	}
}

module.exports = MySQLWrapper;