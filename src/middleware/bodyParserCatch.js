module.exports = async (err, req, res, next) => {
	if (err) {
		return res.status(400).send({
			success: false,
			message: 'Malformed request body.'
		});
	}
	return next();
}