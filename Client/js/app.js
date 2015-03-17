var EvalClient = angular.module('EvalClient',['ngRoute']);

angular.module('EvalClient').constant("SERVER_URL", "http://dispatch.ru.is/h33/api/v1/");

angular.module('EvalClient').factory('LoginResource',['$http', 'SERVER_URL', function ($http, SERVER_URL){
	return{
		login: function (template){
			return $http.post(SERVER_URL + "login", template);
		}
	}
}]);

angular.module('EvalClient').factory('TokenResource', function(){
	var tokenArray = [];
	return{
		storetoken: function(user,token){
			var tokendetails = {
				user: user,
				token: token
			};
			console.log("storing " + tokendetails.user);
			tokenArray.push(tokendetails);
			console.log(tokenArray[0]);
		},
		gettoken: function(user){
			for(var i in tokenArray){
				console.log("getting " + tokenArray[i].user);
				console.log("his auth is " + tokenArray[i].token);
				if(tokenArray[i].user === user){
					console.log("found ya!");
					return tokenArray[i].token;
				}
			}
		}
	}
});

angular.module('EvalClient').factory('CourseResource', ['$http', 'SERVER_URL', function ($http, SERVER_URL){

	return{
		getcourses: function(user){
			return $http.get(SERVER_URL + "my" + "/courses");
		}
	}
}]);


angular.module('EvalClient').config(
	['$routeProvider', '$httpProvider',
	function ($routeProvider, $httpProvider) {
		$routeProvider
			.when('/login', { templateUrl: 'views/login.html', controller: 'LoginController' })
			.when('/student/:user/', { templateUrl: 'views/student.html', controller: 'StudentController'})
			.when('/admin/:admin/', { templateUrl: 'views/admin.html', controller: 'AdminController'})
			.otherwise({
	  			redirectTo: '/login'
			});

	}
]);

angular.module('EvalClient').controller('LoginController',['$scope', '$location', '$rootScope', '$routeParams', '$http', 'LoginResource', 'TokenResource',
	function ($scope, $location, $rootScope, $routeParams, $http, LoginResource,TokenResource){
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
            		console.log("the token " + response.Token);

            		/*Get auth token and store it in factory for later usage*/
            		TokenResource.storetoken(obj.user, response.Token);



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

angular.module('EvalClient').controller('StudentController', ['$scope', '$location', '$rootScope', '$routeParams', 
	'$http','TokenResource', 'CourseResource', 
	function ($scope, $location, $rootScope, $routeParams, $http, TokenResource, CourseResource){
		console.log("routeparams dude: " + $routeParams.user);
		var tokenius = TokenResource.gettoken($routeParams.user);
		console.log("tokenius: " + tokenius);

		/*token to send with request*/
		$http.defaults.headers.common.Authorization = "Basic " + tokenius;

		CourseResource.getcourses($routeParams.user).success(function(response){
			console.log("success course api");
			console.log(response);
		})
		.error(function(error){
			console.log("error: " + error);
			console.log("fail course api");
		});

		
	}]);

angular.module('EvalClient').controller('AdminController', ['$scope', '$location', '$rootScope', '$routeParams', '$http', 'TokenResource',
	function ($scope, $location, $rootScope, $routeParams, $http, TokenResource){

		var courseQ = [];
		var teachQ = [];
		var answers = [];

		$("#menu-toggle").click(function(e) {
        	e.preventDefault();
        	$("#wrapper").toggleClass("toggled");
    	});
		console.log("Name " + $scope.tName);
		console.log("Intro " + $scope.intro);
		var ans = {};
		var quest = {};
		$scope.addAnswer = function() {
			$('#Answer').val('');
			ans = {
				//ID: 1,
		        Text: $scope.Answer,
		        TextEN: $scope.Answer,
		        ImageUR: "none",
		        Weight: 5
			};
			answers.push(ans);
		};
		$scope.addQuestion = function() {
			$('#Qestion').val('');
			var a = answers.slice();
			quest = {
    			//ID: 1,
			  	Text: $scope.Qestion,
			  	TextEN: $scope.Qestion,
			  	ImageURL: "none",
			  	Type: "none",
			  	Answer: a
    		};
    		answers.length = 0;
    		//$scope.answers.length = 0;

			if (document.getElementById('course').checked) {
				courseQ.push(quest);
				console.log("courseQ.length: " + courseQ.length);
			}else if(document.getElementById('teacher').checked){
				teachQ.push(quest);
				console.log("teachQ.length: " + teachQ.length);
			}
		};
		var template = {};
    	$scope.createTemplate = function() {
    		console.log("Name: " + $scope.tName);
    		console.log("courseQ.length: " + courseQ.length);
    		var cQ = courseQ.slice();
    		var tQ = teachQ.slice();
    		template = {
    			//ID: 1,
			  	Title: $scope.tName,
			  	TitleEN: $scope.tName,
			  	IntroText: $scope.intro,
			  	IntroTextEN: $scope.intro,
    			CourseQuestions: cQ,
    			TeacherQuestions: tQ
    		};
    		//var obj = JSON.parse($scope.template);
    		//console.log(obj);
    		if(template.CourseQuestions.length === 0 && template.TeacherQuestions.length === 0){
    			console.log("error");
    			console.log(template);
    		}else{
    			// Create template
    			console.log("ekki error");
    			console.log(template);
    			courseQ.length = 0;
    			teachQ.length = 0;
    			//$scope.teachQ.length = [];
    		}	
    	};
	}]);















