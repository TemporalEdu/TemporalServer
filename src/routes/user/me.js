module.exports = {
	name: 'me',
	path: '/user/me',
	enabled: true,
	method: 'get',
	ratelimit: {
		// The maximum number of requests that can be made in the time window
		max: 10,
		// The time window in milliseconds
		window: 1000
	},
	access: {
		signedIn: true
	},
	handler: async (req, res) => {
		// Get the user from the database (global)
		const user = await global.database.user.get.by({
			username: req.user.username,
			safe: true,
		});
		// If the user doesn't exist, send an error
		if (user === null) {
			return res.status(404).send({
				success: false,
				message: 'User not found.'
			});
		}
		// Send the user to the client
		return res.status(200).send({
			success: true,
			user: user
		});
	}
}