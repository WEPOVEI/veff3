var EvalClient = angular.module('EvalClient',['ngRoute']);

//angular.module('EvalClient').constant('SERVER_URL', 'http://dispatch.ru.is/h33/api/v1/');
/*angular.module('EvalClient').factory('LoginResource',['$http', 'SERVER_URL', function($http, SERVER_URL){
	return{
		postLogin: function (template){
			$http.post(SERVER_URL + 'login/', template);
		}
	}
}]);*/


angular.module('EvalClient').config(
	['$routeProvider',
	function ($routeProvider) {
		$routeProvider
			.when('/login', { templateUrl: 'views/login.html', controller: 'LoginController' })
			.when('/student/:user/', { templateUrl: 'views/student.html', controller: 'StudentController'})
			.when('/admin/:admin/', { templateUrl: 'views/admin.html', controller: 'AdminController'})
			.otherwise({
	  			redirectTo: '/login'
			});
	}
]);

angular.module('EvalClient').controller('LoginController',['$scope', '$location', '$rootScope', '$routeParams', '$http', 
	function ($scope, $location, $rootScope, $routeParams, $http){
		console.log("login");
		$scope.user = '';
		$scope.password = '';
		$scope.admin = '';
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

            	$http.post("http://dispatch.ru.is/h33/api/v1/login", obj).success(function(data){

            		console.log("dosi hoe");
            		if(data.User.Role === 'student'){
            			$location.path(/student/ + $scope.user);
            		}
            		else if(data.User.Role === 'admin'){
            			$location.path(/admin/ + $scope.admin);
            		}
            		//console.log(data.User.Role);
            	});
            }
		};
}]);

angular.module('EvalClient').controller('StudentController', ['$scope', '$location', '$rootScope', '$routeParams', '$http', 
	function ($scope, $location, $rootScope, $routeParams, $http){
		
	}]);

angular.module('EvalClient').controller('AdminController', ['$scope', '$location', '$rootScope', '$routeParams', '$http', 
	function ($scope, $location, $rootScope, $routeParams, $http){
		
	}]);
























