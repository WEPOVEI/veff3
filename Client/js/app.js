var EvalClient = angular.module('EvalClient',['ngRoute']);
angular.module('EvalApp').constant('SERVER_URL', 'http://dispatch.ru.is/h33/api/v1/');

angular.module('EvalClient').factory('LoginResource',['$http', 'SERVER_URL', function($http, SERVER_URL){
	return{
		postLogin: function (template){
			$http.post(SERVER_URL + 'login', template);
		}
	}
}]);


angular.module('EvalClient').config(
	['$routeProvider',
	function ($routeProvider) {
		$routeProvider
			.when('/login', { templateUrl: 'views/login.html', controller: 'LoginController' })
			.otherwise({
	  			redirectTo: '/login'
			});
	}
]);

angular.module('EvalClient').controller('LoginController',['$scope', '$location', '$rootScope', '$routeParams', 'LoginResource', 
	function ($scope, $location, $rootScope, $routeParams, LoginResource){
		console.log("login");
		$scope.user = '';
		$scope.password = '';
		$scope.login = function() {
            if($scope.user === ''|| $scope.password === ''){
            	console.log("error msg");
            }
            else{
            	console.log("User: " + $scope.user);
            	console.log("Pass: " + $scope.password);

            	var obj = {
            		user: $scope.user,
            		pass: $scope.password
            	};

            	LoginResource.postLogin(obj).success(function(data){
					console.log('vei');
				});
            }
		};
}]);


























