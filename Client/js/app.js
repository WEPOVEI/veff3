var EvalClient = angular.module('EvalClient',['ngRoute']);

EvalClient.config(
	function($routeProvider){
		$routeProvider
			.when('/login', {templateUrl: 'Views/login.html', controller: 'LoginController'})
			.otherwise({
				redirectTo: '/login'
			});
	}


);

EvalClient.controller('LoginController', function ($scope, $location, $rootScope, $routeParams){
		console.log("login");
});