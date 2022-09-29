const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

let leftPad = (str, len, char) => {
	str = str.toString();
	while (str.length < len) {
		str = char + str;
	}
	return str;
}

class TemporalLogger {
	constructor(logDir) {
		this._logs = [];
		// Check if there's a logs folder
		if (!fs.existsSync(logDir)) {
			// Create the logs folder
			fs.mkdirSync(logDir);
		}
		// Create log file name
		const date = new Date();
		const dateString = `${date.getFullYear()}-${leftPad(date.getMonth() + 1, 2, '0')}-${leftPad(date.getDate(), 2, '0')}`;
		// While the log file exists, add a number to the end of the file name
		let i = 1;
		let logFileName = `${dateString}.log`;
		while (fs.existsSync(path.join(logDir, logFileName))) {
			logFileName = `${dateString}-${i}.log`;
			i++;
		}
		// Create the log file
		this._logFile = fs.createWriteStream(path.join(logDir, logFileName), {flags: 'a'});
		// Log the start of the server
	}

	// Debug log
	debug(message) {
		// Log the message
		this._log(message, 'debug');
	}

	// Info log
	info(message) {
		// Log the message
		this._log(message, 'info');
	}

	// Warning log
	warn(message) {
		// Log the message
		this._log(message, 'warn');
	}

	// Error log
	error(message) {
		// Log the message
		this._log(message, 'error');
	}

	// Fatal log
	fatal(message) {
		// Log the message
		this._log(message, 'fatal');
		// Exit the process
		process.exit(1);
	}

	logRaw(message) {
		// Log the message
		console.log(message);
		this._logFile.write(`${message}\n`);
	}

	// Log a message
	_log(message, level) {
		// Log prints both to console and writes to file
		// Get the current date
		const date = new Date();
		// Get the date string
		const dateString = `${date.getFullYear()}-${leftPad(date.getMonth() + 1, 2, '0')}-${leftPad(date.getDate(), 2, '0')} ${leftPad(date.getHours(), 2, '0')}:${leftPad(date.getMinutes(), 2, '0')}:${leftPad(date.getSeconds(), 2, '0')}`;
		// Get the log string
		const logString = `[${dateString}] [${level.toUpperCase()}] ${message}`;
		// Print the log string to the console
		switch (level) {
			case 'debug':
				console.log(chalk.gray(logString));
				break;
			case 'info':
				console.log(logString);
				break;
			case 'warn':
				console.log(chalk.yellow(logString));
				break;
			case 'error':
				console.log(chalk.red(logString));
				break;
			case 'fatal':
				console.log(chalk.red(logString));
				break;
		}
		// Write the log string to the log file
		this._logFile.write(`${logString}\n`);

		// Add the log to the logs array
		this._logs.push({
			date: date, level: level, message: message
		});
	}

	// Get the logs
	getLogs() {
		return this._logs;
	}

	// Get the log file
	getLogFile() {
		return this._logFile;
	}

	// Close the log file
	closeLogFile() {
		this._logFile.end();
	}

	// Get the log file path
	getLogFilePath() {
		return this._logFile.path;
	}

	// Get the log file name
	getLogFileName() {
		return path.basename(this._logFile.path);
	}

	// Get the log file size
	getLogFileSize(scale = 'KB') {
		// Get the log file size in bytes
		const size = fs.statSync(this._logFile.path).size;
		// Convert the size to the specified scale
		switch (scale) {
			case 'B':
				return size;
			case 'KB':
				return size / 1000;
			case 'MB':
				return size / 1000000;
			case 'GB':
				return size / 1000000000;
		}

		// Return the size in bytes
		return size;
	}
}

module.exports = TemporalLogger;