var mongoose = require('mongoose');


var templateSchema = mongoose.Schema({
	Title: String,
	TitleEN: String,
	IntroText: String,
	IntroTextEN: String,
	CourseQuestions: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'questions'
	}],
	TeacherQuestions: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'questions'
	}]
});

var Template = mongoose.model('templates', templateSchema);

module.exports = Template;