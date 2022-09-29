// Main file for MongoDB database wrapper, it will export all necessary functions, schemas, and models for the server to use.

const mongoose = require('mongoose');
const { Schema } = mongoose;

class MongoWrapper {
	constructor(connectionURI) {
		this.connection = null;
		this.connectionURI = connectionURI;
	}

	async connect() {
		// Connect to the database
		this.connection = await mongoose.connect(this.connectionURI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
			useCreateIndex: true
		});

		// Log the connection

	}
}