var mongoose = require('mongoose');

var questionSchema = mongoose.Schema({
	Text: String,
	TextEN: String,
	ImageURL: String,
	TeacherSSN: String,
	Type: String, // Can be of type text, single, multiple
	Answers: [{
		_id: String,
		TextEN: String,
		Text: String,
		ImageURL: String,
		Type: String,
		Weight: String
	}]
});

var Question = mongoose.model('questions', questionSchema);

module.exports = Question;