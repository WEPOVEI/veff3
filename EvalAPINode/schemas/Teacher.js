var mongoose = require('mongoose');

var teacherSchema = mongoose.Schema({
	Username: String,
	Fullname: String,
	SSN: String,
	Email: String,
	Role: String,
	ImageURL: String
});

var Teacher = mongoose.model('teachers', teacherSchema);

module.exports = Teacher;