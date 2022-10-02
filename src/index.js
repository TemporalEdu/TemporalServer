/*
 * (c) Temporal Education Developers 2022. All rights reserved.
 *
 * This is the entry point for TemporalServer. It is responsible for
 * starting the server and handling all requests, providing any client
 * REST API access to the TemporalServer.
 */

const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');

// The server is built to be fast but configurable. This is why we provide multiple options for databases.
// The default database is MongoDB, but we also support SQLite, MySQL, and PostgreSQL.
const MongoWrapper = require('./database/mongodb');
const SQLiteWrapper = require('./database/sqlite');
const MySQLWrapper = require('./database/mysql');
const PostgreSQLWrapper = require('./database/postgres');

// Other dependencies
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const Logger = require('./utils/logger/index');
const logger = new Logger(path.join(__dirname, 'logs'));

const auth = require('./middleware/auth');
const bodyParserCatch = require('./middleware/bodyParserCatch');

const globalConfig = require('./config/global.json');

// Hacky way to make logger available to all files
global.logger = logger;
global.database = null;
global.config = globalConfig;

// Local dependencies
const printBanner = require('./utils/printBanner');
const getRoutes = require('./utils/getRoutes');
const attachRoutes = require('./server/attachRoutes');

printBanner();

// Load environment variables
dotenv.config();

// Choose the database to use
const database = process.env.DATABASE || 'mongodb';

// Create the Express server
const app = express();

// Connect to the database
if (database === 'mongodb') {
	// Connect to MongoDB
	global.database = new MongoWrapper(process.env.MONGODB_URI);
} else if (database === 'sqlite') {
	// Connect to SQLite
	global.database = new SQLiteWrapper(process.env.SQLITE_FILE);
} else if (database === 'mysql') {
	// Connect to MySQL
	global.database = new MySQLWrapper(process.env.MYSQL_HOST, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, process.env.MYSQL_DATABASE);
} else if (database === 'postgres') {
	// Connect to PostgreSQL
	global.database = new PostgreSQLWrapper(process.env.POSTGRES_HOST, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, process.env.POSTGRES_DATABASE);
}

global.database.connect();

// Enable middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParserCatch);
app.use(auth);

// Connect to the database
// TODO: Add support for database connection in separate files

// Attach routes
let routes = getRoutes();
attachRoutes(app, routes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
	logger.info(`Server started on port ${port}`);
});