var mongoose = require('mongoose');


var evaluationSchema = mongoose.Schema({
	StartDate: Number,
	EndDate: Number,
	TemplateID: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'templates'
	}
});

var Evaluation = mongoose.model('evaluations', evaluationSchema);

module.exports = Evaluation;