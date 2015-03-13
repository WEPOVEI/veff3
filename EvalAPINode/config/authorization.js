/*
	Module dependencies
*/
var mongoose = require('mongoose');

// Mongoose models
var User = require('../schemas/User'),
	Token = require('../schemas/AccessToken');


exports.ensureAdmin = function (req, res, next) {

	var access_token = req.get('Authorization');
	
	Token.findOne({ Token: access_token })
	.populate('UserID')
	.exec(function (err, token) {
		if (err) {
			return next(err);
		}
		if (!token) {
			return res.send(400, 'Bad request');
		}

		
		if (token.UserID.Role === 'admin') {
			return next();
		} else {
			return res.send(401, 'Unauthorized');
		}
	});


};

exports.ensureAuthenticated = function (req, res, next) {
	var access_token = req.get('Authorization');
	
	if (!access_token) {
		return res.send(401, 'Unauthorized');
	}
	Token.findOne({Token: access_token}, function (err, token) {
		if (err) {
			return next(err)
		}

		if (!token) {
			return res.send(401, 'Unauthorized');
		} else {
			return next();
		}
	})
};

exports.login = function (req, res, next) {
	var username = req.body.Username,
		password = req.body.Password;

	login(username, password, function (err, data) {

		if (err) {
			next(err);
		} else {
			res.setHeader('Authorization', data.token);
			res.send(200, data.user);
		}
	});
};

function login(username, password, callback) {

	User.findOne({ Username: username }, function (err, user) {
		if (err) {
			return callback(err);
		}
		console.log(password)
		if (!user || !user.validPassword(password)) {
			console.log('Incorrect username or password');
			return callback({
				code: 401,
				message: 'Username or password is incorrect.',
				token: undefined
			});
		}

		Token.findById(user.tokenId, function (err, token) {
			if (err) {
				return callback(err);
			}

			// If user doesn't have a valid access token, we need to create one.
			if (!token) {
				console.log('DEBUG: Token didn\'t exist');
				var token = new Token();
				token.setToken();
				token.UserID = user._id;

				token.save(function (err, token) {
					if (err) {
						return callback(err);
					}

					user.tokenId = token._id;

					user.save(function (err) {
						if (err) {
							return callback(err);
						}

						return callback(null, {
							token: token.Token,
							user: user.Username
						});
					});
				});
			} else {
				if (token.tokenHasExpired()) {
					console.log('DEBUG: Token has expired');
					token.updateExpirationDate();

					token.save(function (err, token) {
						if (err) {

							return callback(null, {
								token: token.token,
								user: user.username
							});
						}
					});
				} else {
					console.log('DEBUG: Token existed');

					return callback(null, {
									token: token.token,
									user: user.username
								});
					}
				
			}

			// Check if the token has expired, if so, update it's expiration date
			
		});
	});
}
