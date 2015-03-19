angular.module('EvalClient').config(
	['$routeProvider',
	function ($routeProvider) {
		$routeProvider
			.when('/login', { templateUrl: 'views/login.html', controller: 'LoginController' })
			.when('/student/:user/', { templateUrl: 'views/student.html', controller: 'StudentController'})
			.when('/admin/:admin/', { templateUrl: 'views/admin.html', controller: 'AdminController'})
			.when('/results/', {templateUrl: 'views/results.html', controller: 'ResultsController'})
			.otherwise({
	  			redirectTo: '/login'
			});
	}
]);