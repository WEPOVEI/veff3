var mongoose = require('mongoose');


var resultSchema = mongoose.Schema({
	QuestionID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'questions'
	},
	CourseID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'courses'
	},
	EvalID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'evaluations'
	},
	TeacherSSN: String,
	Value: String
});

var Result = mongoose.model('results', resultSchema);

module.exports = Result;