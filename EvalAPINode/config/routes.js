var Teacher = require('../schemas/Teacher');
var User = require('../schemas/User');
var Course = require('../schemas/Course');

module.exports = function (app, auth) {

	// Login route
	app.post('/api/v1/login', auth.login);

	// API endpoints

	// For all calls to the api, we need to ensure that the user has as valid access token
	// All calls to the api must include a valid access_token in the query string
	// Example ..api/..?access_token=<valid token>

	app.all('/api/*', auth.ensureAuthenticated);

	// Admin endpoints
	var admin = require('../controllers/admin/index');
	app.post('/signup', admin.signup);
	app.get('/api/v1/evaluationtemplates', auth.ensureAdmin, admin.templates);
	app.post('/api/v1/evaluationtemplates', auth.ensureAdmin, admin.createTemplate);

	app.get('/api/v1/evaluationtemplates/:templateid', auth.ensureAdmin, admin.singleTemplate);
	
	app.get('/api/v1/evaluations', auth.ensureAdmin, admin.evaluations);
	app.post('/api/v1/evaluations', auth.ensureAdmin, admin.createEvaluation);

	app.get('/api/v1/evaluations/:evalid', auth.ensureAdmin, admin.singleEvaluation);

	// Student endpoints
	var student = require('../controllers/student/index');
	app.get('/api/v1/:username/evaluations', student.evaluations);
	app.get('/api/v1/:username/courses', student.courses);

	app.get('/api/v1/courses/:courseid/:semesterid/evaluations/:evalid', student.singleEvaluation);
	app.post('/api/v1/courses/:courseid/:semesterid/evaluations/:evalid', student.submitEvaluation);

	app.get('/api/v1/courses/:courseid/:semesterid/teachers', student.teachers);
	

	// Populating database with teachers, students and courses
	// This route must only be called one time, after that it can be erased
	app.get('/', require('../init').init);
};