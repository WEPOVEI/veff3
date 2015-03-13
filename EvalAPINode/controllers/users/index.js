exports.user = function (req, res, next) {
	
	User.findOne({ username: req.params.user }, function (err, user) {
		if (err) {
			return next(err);
		}
		console.log(user)
		if (!user) {
			return res.send(400, 'Bad request');
		}

		req.user = user;
		console.log('did find user: ' + req.user)
		return next();
	})
}