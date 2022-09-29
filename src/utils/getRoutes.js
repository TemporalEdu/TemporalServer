// Get routes for the server
const fs = require('fs');
const path = require('path');

const getRoutes = () => {
	// The routes folder contains all the routes
	const routesFolder = path.join(__dirname, '..', 'routes');
	// The goal is to get all the routes in the routes folder
	// These routes can be nested - for example, the test route is in routes/test/index.js
	let routes = [];
	// Get all the files in the routes folder
	const files = fs.readdirSync(routesFolder);
	// Depth-first search through the routes folder
	let stack = files;
	while (stack.length > 0) {
		// Get the next file
		const file = stack.pop();
		// Get the file's path
		const filePath = path.join(routesFolder, file);
		// Check if the file is a directory
		if (fs.lstatSync(filePath).isDirectory()) {
			// Get all the files in the directory
			const files = fs.readdirSync(filePath);
			// Add the files to the stack
			stack = stack.concat(files.map(f => path.join(file, f)));
		} else {
			// Get the route
			const route = require(filePath);
			// Add the route to the routes array
			routes.push(route);
		}
	}
	// Return the routes
	return routes;
}

module.exports = getRoutes;