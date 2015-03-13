var User = require('../../schemas/User'),
	Course = require('../../schemas/Course'),
	Evaluation = require('../../schemas/Evaluation'),
	Template = require('../../schemas/Template'),
	Question = require('../../schemas/Question'),
	Result = require('../../schemas/Result'),
	_ = require('underscore'),
	hat = require('hat'),
	async = require('async');


exports.signup = function (req, res, next) {
	var user = new User();

	user.Username = req.body.Username;
	user.Password = user.generateHash(req.body.Password);

	user.Role = req.body.Role;

	user.save(function (err) {
		if (err) {
			console.log('came here with error: ' + err)
			next(500, err);
		}

		res.send('success, added' + req.body.Username);
	});	

};


exports.templates = function (req, res, next) {
	Template.find({}, '_id Title TitleEN', function (err, templates) {
		if (err) {
			return next(err);
		}
		
		return res.json(templates);
	});
};

exports.createTemplate = function (req, res, next) {
	var data = req.body.data;

	var template = new Template();

	template.Title = data.Title;
	template.TitleEN = data.TitleEN;
	template.IntroText = data.IntroText;
	template.IntroTextEN = data.IntroTextEN;

	for (var i = 0; i < data.CourseQuestions.length; i++) {
		var _question = data.CourseQuestions[i];
		var question = new Question();
		question.Text = _question.Text;
		question.TextEN = _question.TextEN;
		question.ImageURL = _question.ImageURL;
		question.Type = _question.Type;

		if (_question.Type === 'single' || _question.Type === 'multiple') {

			for (var j = 0; j < _question.Answers.length; j++) {

				var answer = _question.Answers[j];
				answer._id = hat();

				question.Answers.push(answer);
			}
		}

		question.save(function (err, question) {
			if (err) {
				return next(err);
			}

			template.CourseQuestions.push(question._id);
			template.save(function (err) {
				if (err) {
					return next(err);
				}
			});
		});
		
	}
	
	for (var i = 0; i < data.TeacherQuestions.length; i++) {
		var _question = data.TeacherQuestions[i];
		var question = new Question();
		question.Text = _question.Text;
		question.TextEN = _question.TextEN;
		question.ImageURL = _question.ImageURL;
		question.Type = _question.Type;

		if (_question.Type === 'single' || _question.Type === 'multiple') {
			for (var j = 0; j < _question.Answers.length; j++) {
				var answer = _question.Answers[j];
				answer._id = hat();
				question.Answers.push(answer);
			}
		}

		question.save(function (err, question) {
			if (err) {
				return next(err);
			}
			template.TeacherQuestions.push(question._id);
			template.save(function (err) {
				if (err) {
					return next(err);
				}
			});
		});
	}


	template.save(function (err) {
		if (err) {
			return next(err);
		}

		res.send(200, 'Successfully added new template');
	});
};

exports.singleTemplate = function (req, res, next) {
	var templateid = req.params.templateid;

	Template.findOne({ _id: templateid })
	.populate('TeacherQuestions')
	.populate('CourseQuestions')
	.exec(function (err, template) {
		return res.json(template);
	});
};

exports.evaluations = function (req, res, next) {
	Evaluation.find({})
	.populate('TemplateID')
	.exec(function (err, evaluations) {
		if (err) {
			return next(err);
		}
		var evals = [];
		var now = new Date().getTime();
		for (var i = 0; i < evaluations.length; i++) {
			var evalInstance = {};
			var eval = evaluations[i];
			evalInstance.TemplateTitle = eval.TemplateID.Title;
			evalInstance.TemplateTitleEN = eval.TemplateID.TitleEN;
			evalInstance.StartDate = eval.StartDate;
			evalInstance.EndDate = eval.EndDate;
			evalInstance.ID = eval._id;
			if (eval.endDate < now) {
				evalInstance.Status = 'closed';
			} else if (eval.startDate > now) {
				evalInstance.Status = 'new';
			} else {
				evalInstance.Status = 'open';
			}
			evals.push(evalInstance);
		}
		res.send(200, evals);
	});
};

exports.createEvaluation = function (req, res, next) {
	var templateId = req.body.TemplateID,
		StartDate = req.body.StartDate,
		EndDate = req.body.EndDate;
	
	if (StartDate > EndDate) {
		next('Start date must precede end date');
	}

	Template.findById(templateId, '_id', function (err, template) {

		if (err) {
			return next(err);
		}

		if (!template) {
			return res.send(400, 'Could not find template with id: ' + templateId);
		}

		var evaluation = new Evaluation();

		evaluation.StartDate = StartDate;
		evaluation.EndDate = EndDate;
		evaluation.TemplateID = template._id;

		evaluation.save(function (err) {
			if (err) {
				return next(err);
			}

			res.send(200, 'Successfully created new evaluation');
		});
	});
};

exports.singleEvaluation = function (req, res, next) {
	var evaluationId = req.params.evalid;

	var evaluationInstance = {};
	//Retrieve the correct evaluation
	Evaluation.findById(evaluationId)
	.populate('TemplateID')
	.exec(function (err, evaluation) {
		if (err) {
			return next(err);
		}

		Template.findById(evaluation.TemplateID._id)
		.populate('CourseQuestions TeacherQuestions')
		.exec(function (err, template) {
			if (err) {
				return next(err);
			}
			
			var CourseQuestions = template.CourseQuestions;
			var TeacherQuestions = template.TeacherQuestions;
			

			Result.find({ EvalID: evaluation._id })
			.populate('EvalID CourseID QuestionID')
			.exec(function (err, results) {
				if (err) {
					return next(err);
				}
				console.log(results)
				var courseIDs = [];
				for (var i = 0; i < results.length; i++) {
					if (courseIDs.indexOf(results[i].CourseID) === -1) {
						courseIDs.push(results[i].CourseID)
					}
				}
				
				Course.find({ _id: { $in: courseIDs} })
				.populate('Teachers')
				.exec(function (err, courses) {

					evaluationInstance.ID = evaluation._id;
					evaluationInstance.TemplateID = template._id;
					evaluationInstance.TemplateTitle = template.Title;
					evaluationInstance.TemplateTitleEN = template.TitleEN;
					evaluationInstance.Courses = [];
					
					for (var i = 0; i < courses.length; i++) {

						var course = courses[i];
						evaluationInstance.Courses.push({
							ID: course._id,
							CourseID: course.CourseID,
							CourseNameEN: course.NameEN,
							CourseName: course.Name,
							Semester: '20151',
							Questions: []
						});
					}

					var i = 0;
					async.whilst(
						function () { return i < evaluationInstance.Courses.length},
						function (next) {

							var c = evaluationInstance.Courses[i];
							var courseAnswers = _.where(results, { 'CourseID._id': c._id });
						
							for (var j = 0; j < CourseQuestions.length; j++) {
								var result = CreateEvaluationResult(CourseQuestions[j], courseAnswers, null);
								evaluationInstance.Courses[i].Questions.push(result);
							}

							Course.findById(c.ID)
							.populate('Teachers', 'SSN')
							.exec(function (err, courseTeachers) {
								
								if (err) {
									return next(err);
								}
								var teachers = courseTeachers.Teachers;
								for (var k = 0; k < teachers.length; k++) {
									for (var p = 0; p < TeacherQuestions.length; p++) {

										var result = CreateEvaluationResult(TeacherQuestions[p], courseAnswers, teachers[k].SSN);
										evaluationInstance.Courses[i].Questions.push(result);
									}
								}
								i++;
								next();
							});
							
						},
						function (err) {
							return res.send(200, evaluationInstance)
						}
					);
				});
			});
		});
	});
};

function getTeachers (courseID, callback) {
	
};

function CreateEvaluationResult(question, courseAnswers, ssn) {
	
	var result = {
		QuestionID: question._id,
		TextEN: question.TextEN,
		Text: question.Text,
		Type: question.Type
	};
	
	if (question.Type === 'text') {
		result.TextResults = [];
		
		textResults = _.filter(courseAnswers, function (el) {
			return (((el.QuestionID._id).toString() === (question._id).toString()) && (el.TeacherSSN === ssn))
		});
		result.TeacherSSN = ssn
		for (var i = 0; i < textResults.length; i++) {
			
			result.TextResults.push(textResults[i].Value);
		}
	} 
	else if (question.Type === 'single' || question.Type === 'multiple') {
		result.OptionsResults = [];

		result.TeacherSSN = ssn;
		for (var i = 0; i < question.Answers.length; i++) {

			var count = 0;
			for (var j = 0; j < courseAnswers.length; j++) {
				var a = courseAnswers[j];

				if ((a.QuestionID._id).toString() === (question._id).toString() 
					&& a.Value === question.Answers[i].Weight
					&& a.TeacherSSN === ssn) { count++ };
			}
			
			result.OptionsResults.push({
				Answer: question.Answers[i]._id,
				AnswerText: question.Answers[i].Text,
				AnswerTextEN: question.Answers[i].TextEN,
				Weight: question.Answers[i].Weight,
				Count: count
			});
		}
	}
	
	return result;
};