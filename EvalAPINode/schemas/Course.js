var mongoose = require('mongoose');


var courseSchema = mongoose.Schema({
	CourseID: String,
	Name: String,
	NameEN: String,
	DateBegin: Date,
	DateEnd: Date,
	Teachers: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'teachers'
	}]
});

var Course = mongoose.model('courses', courseSchema);

module.exports = Course;