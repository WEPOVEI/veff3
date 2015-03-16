var EvalClient = angular.module('EvalClient',['ngRoute']);

angular.module('EvalClient').constant("SERVER_URL", "http://dispatch.ru.is/h33/api/v1/");
angular.module('EvalClient').factory('LoginResource',['$http', 'SERVER_URL', function($http, SERVER_URL){
	return{
		login: function (template){
			return $http.post(SERVER_URL + "login", template);
		}
	}
}]);


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

angular.module('EvalClient').controller('LoginController',['$scope', '$location', '$rootScope', '$routeParams', '$http', 'LoginResource', 
	function ($scope, $location, $rootScope, $routeParams, $http, LoginResource){
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

            	LoginResource.login(obj).success(function(response){
            		console.log("success");

            		if(response.User.Role === 'student'){
            			$location.path(/student/ + $scope.user);
            		}
            		else if(response.User.Role === 'admin'){
            			$location.path(/admin/ + $scope.user);
            		}
            		console.log(response.User.Role);

            	})
            	.error(function(){
            		console.log("fail");
            	});
            }
		};

			/* press enter to login*/
            	$("#password").keyup(function(event){
	    			if(event.keyCode == 13){
	        			$("#login").click();
	    			}
				});
}]);

angular.module('EvalClient').controller('StudentController', ['$scope', '$location', '$rootScope', '$routeParams', '$http', 
	function ($scope, $location, $rootScope, $routeParams, $http){
		
	}]);

angular.module('EvalClient').controller('AdminController', ['$scope', '$location', '$rootScope', '$routeParams', '$http', 
	function ($scope, $location, $rootScope, $routeParams, $http){

		$scope.courseQ = [];
		$scope.teachQ = [];

		$("#menu-toggle").click(function(e) {
        	e.preventDefault();
        	$("#wrapper").toggleClass("toggled");
    	});
		console.log("Name " + $scope.tName);
		console.log("Intro " + $scope.intro);
		$scope.addQuestion = function() {
			$scope.ans = {
				ID: 1,
		        Text: $scope.Answer,
		        TextEN: $scope.Answer,
		        ImageUR: "none",
		        Weight: 5
			};
			$scope.quest = {
    			ID: 1,
			  	Text: $scope.Qestion,
			  	TextEN: $scope.Qestion,
			  	ImageURL: "none",
			  	Type: "none",
			  	Answer: $scope.ans
    		};
			if (document.getElementById('course').checked) {
				$scope.courseQ.push($scope.quest);
			}else if(document.getElementById('teacher').checked){
				$scope.teachQ.push($scope.quest);
			}
			console.log("Question: " + $scope.Qestion);

			$('#Qestion').val('');
			$('#Answer').val('');
		};

    	$scope.createTemplate = function() {
    		console.log("Name: " + $scope.tName);
    		$scope.template = {
    			ID: 1,
			  	Title: $scope.tName,
			  	TitleEN: $scope.tName,
			  	IntroText: $scope.intro,
			  	IntroTextEN: $scope.intro,
    			CourseQuestions: $scope.courseQ,
    			TeacherQuestions: $scope.teachQ
    		};
    		if($scope.template.CourseQuestions.length ===0 && $scope.template.TeacherQuestions.length == 0){
    			console.log("error");
    		}else{
    			// Create template
    			console.log("ekki error");
    			console.log($scope.template);
    		}
    	};
	}]);















