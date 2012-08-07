exports.index = function(req, res, next) {
	// app is available in req.app
	res.send('authenticated');
};
