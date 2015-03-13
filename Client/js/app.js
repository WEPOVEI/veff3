var EvalClient = angular.module('EvalClient',['ngRoute']);

angular.module('EvalClient').config(['#routeProvider',
	function($routeProvider){
		console.log('config');
		$routeProvider
			.when('/login', {templateUrl: 'Views/login.html', controller: 'LoginController'})
			.otherwise({
				redirectTo: '/login'
			});
	}


]);

angular.module('EvalClient').controller('LoginController', ['$scope', '$location', '$rootScope', '$routeParams', 
	function ($scope, $location, $rootScope, $routeParams){
		console.log("login");
}]);