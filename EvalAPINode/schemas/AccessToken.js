var mongoose = require('mongoose');
var hat = require('hat');

var tokenSchema = mongoose.Schema({
	Token: String,
	Expires: Number,
	UserID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'users'
	}
});

tokenSchema.methods.setToken = function () {

	this.Expires = new Date().getTime() + 60 * 60 * 2; // Two day access token
	this.Token = hat();
};

tokenSchema.methods.tokenHasExpired = function () {

	return this.Expires >= new Date().getTime();
};

tokenSchema.methods.updateExpirationDate = function () {
	this.Expires = new Date().getTime() + 60 * 60 * 2;
};

var tokens = mongoose.model('access_tokens', tokenSchema);

module.exports = tokens;