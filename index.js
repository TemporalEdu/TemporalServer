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
const mongoose = require('mongoose');
const sqlite3 = require('sqlite3').verbose();
const mysql = require('mysql');
const pg = require('pg');

// Other dependencies
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { v4: uuidv4 } = require('uuid');

// Local dependencies
const printBanner = require('./utils/printBanner');
const getRoutes = require('./utils/getRoutes');
const attachRoutes = require('./server/attachRoutes');

// Load environment variables
dotenv.config();

// Create the Express server
const app = express();

// Enable middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to the database
// TODO: Add support for database connection in separate files

// Attach routes
let routes = getRoutes();
attachRoutes(app, routes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
	printBanner();
	console.log(`Server started on port ${port}`);
});