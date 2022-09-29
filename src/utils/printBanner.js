// Print Ascii logo into console
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');

const printBanner = () => {
	const banner = fs.readFileSync(path.join(__dirname, '..', 'assets', 'ascii-banner.txt'), 'utf8');
	// Get the version from package.json
	const pkg = require(path.join(__dirname, '..', '..', 'package.json'));
	console.log(banner.replace("{version}", pkg.version));
}

module.exports = printBanner;