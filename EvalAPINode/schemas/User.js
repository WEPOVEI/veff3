var mongoose = require('mongoose');

var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
	Username: String,
	Password: String,
	Fullname: String,
	Email: String,
	SSN: String,
	Role: String,
	TokenId: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'access_tokens'
	},
	Courses: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'courses'
	}]
});

userSchema.methods.generateHash = function (password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function (password) {
	return bcrypt.compareSync(password, this.Password);
};

var User = mongoose.model('users', userSchema);

module.exports = User;