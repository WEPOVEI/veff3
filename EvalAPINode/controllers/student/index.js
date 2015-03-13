var User = require('../../schemas/User'),
	Course = require('../../schemas/Course'),
	Evaluation = require('../../schemas/Evaluation'),
	Template = require('../../schemas/Template'),
	Result = require('../../schemas/Result');


exports.evaluations = function (req, res, next) {
	var username = req.params.username;
	User.findOne({ Username: username })
	.populate('Courses', 'CourseID Name NameEN')
	.exec(function (err, user) {
		var now = new Date().getTime();
		Evaluation.find({})
		.where('StartDate').lt(now)
		.where('EndDate').gt(now)
		.select('_id')
		.exec(function (err, evaluations) {
			var eval = [];
			console.log(user)
			if (user.Courses !== null && evaluations !== null)
			{
				for (var i = 0; i < user.Courses; i++) {
					for (var j = 0; j < evaluations; j++) {
						eval.push({
							ID: evaluations[j]._id,
							CourseID: user.Courses[i].CourseID,
							CourseName: user.Courses[i].Name,
							CourseNameEN: user.Courses[i].NameEN,
							Semester: '20151'
						});
					}
				}
			}
			return res.send(200, eval);
		});
	});
};

exports.singleEvaluation = function (req, res, next) {
	var	evaluationId = req.params.evalid;

	Evaluation.findById(evaluationId)
	.populate('TemplateID', 'CourseQuestions TeacherQuestions')
	.exec(function (err, evaluation) {
		res.send(200, {
			ID: evaluation._id,
			CourseQuestions: evaluation.TemplateID.CourseQuestions,
			TeacherQuestions: evaluation.TemplateID.TeacherQuestions
		})
	})

};

exports.submitEvaluation = function (req, res, next) {
	var evaluationId = req.params.evalid,
		courseId = req.params.courseid;
	var answers = req.body.answers;
	for (var i = 0; i < answers.length; i++) {
		var result = new Result();

		result.CourseID   = courseId;
		result.QuestionID = answers[i].QuestionID;
		result.EvalID     = evaluationId;
		result.Value      = answers[i].Value;
		result.TeacherSSN = answers[i].TeacherSSN;

		result.save(function (err) {
			if (err) {
				return next(err);
			}
		});	
	}
	res.send(200);
	
};

exports.teachers = function (req, res, next) {
	var courseId = req.params.courseid,
		semesterId = req.params.semesterid; // This won't be used in this version

	Course.findOne({ _id: courseId })
	.populate('Teachers', 'Fullname SSN ImageURL')
	.exec(function (err, course) {
		if (err) {
			return next(err);
		}

		return res.send(200, course.teachers);
	});
};

exports.courses = function (req, res, next) {
	var username = req.params.username;

	User.findOne({ Username: username })
	.populate('Courses')
	.exec(function (err, student) {
		if (err) {
			return next(err);
		}
		res.send(200, student.Courses);

	});
};