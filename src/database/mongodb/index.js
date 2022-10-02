// Main file for MongoDB database wrapper, it will export all necessary functions, schemas, and models for the server to use.

const mongoose = require('mongoose');
const { Schema } = mongoose;

class MongoWrapper {
	constructor(connectionURI) {
		this.connection = null;
		this.connectionURI = connectionURI;
	}

	async connect() {
		if (!this.connectionURI) {
			global.logger.error('No connection URI provided for MongoDB');
		}
		if (this.connection) {
			global.logger.warn("Database connection already exists. Try reconnecting instead.");
			return;
		}
		try {
			// Connect to the database
			this.connection = await mongoose.connect(this.connectionURI, {
				useNewUrlParser: true,
				useUnifiedTopology: true,
			});

			// Log the connection
			global.logger.info("Connected to MongoDB database");
		} catch (err) {
			// Log the error
			global.logger.logRaw(err.stack);
			global.logger.fatal("Failed to connect to MongoDB database");
		}
	}

	user = {
		get: require('./user/get'),
		create: require('./user/create'),
		delete: require('./user/delete'),
	}

	session = {
		get: require('./session/get'),
		create: require('./session/create'),
		delete: require('./session/delete'),
	}
}

module.exports = MongoWrapper;