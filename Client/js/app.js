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
			//console.log("storing " + tokendetails.user);
			tokenArray.push(tokendetails);
			//console.log(tokenArray[0]);
		},
		gettoken: function(user){
			for(var i in tokenArray){
				//console.log("getting " + tokenArray[i].user);
				//console.log("his auth is " + tokenArray[i].token);
				if(tokenArray[i].user === user){
					//console.log("found ya!");
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

angular.module('EvalClient').factory('TemplateResource', ['$http', 'SERVER_URL', function ($http, SERVER_URL){

	return{
		gettemplates: function(){
			return $http.get(SERVER_URL + "/evaluationtemplates");
			//$http.get("http://dispatch.ru.is/h33/api/v1/evaluationtemplates")
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

angular.module('EvalClient').controller('LoginController',
	['$scope', '$location', '$rootScope', '$routeParams', '$http', 'LoginResource', 'TokenResource',
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

angular.module('EvalClient').controller('StudentController', 
	['$scope', '$location', '$rootScope', '$routeParams', '$http','TokenResource', 'CourseResource', 
	function ($scope, $location, $rootScope, $routeParams, $http, TokenResource, CourseResource){
		$scope.courseobjarr = [];
		$scope.currentuser = $routeParams.user;
		$scope.evalarr = [];
		var tokenius = TokenResource.gettoken($routeParams.user);

		/*token to send with request*/
		$http.defaults.headers.common.Authorization = "Basic " + tokenius;

		/* get all courses from api and push course objects into array for later usage*/
		CourseResource.getcourses($routeParams.user).success(function (response){

			for(var i in response){
				$scope.courseobjarr.push(response[i]);
			}
		})
		.error(function(error){
			console.log("error: " + error);
			console.log("fail course api");
		});

		$http.get("http://dispatch.ru.is/h33/api/v1/my/evaluations").success(function (response){
			for(var i in response){
				//console.log(response[i]);
				$scope.evalarr.push(response[i]);
			}
		})
		.error(function (){
			console.log("err");
		});

		$scope.evaltitle = '';
		$scope.evaltitleEN = '';
		$scope.coursequest = [];
		//$scope.
		$scope.geteval = function(courseid, semester, id) {
			console.log(courseid);
			console.log(semester);
			console.log(id);
			$http.get("http://dispatch.ru.is/h33/api/v1/courses/" + courseid + "/" + semester + "/" + "evaluations/" + id)
			.success(function (response){
				console.log("schnilld")
				console.log(response);

				console.log(response.Title);
				console.log(response.TitleEN);
				
				var s = response["CourseQuestions"];
				console.log(s);
				var ans = response["Answers"];
				console.log(ans);

			})
			.error(function (){
				console.log("vesen");
			});
		};

		$scope.postAnswers = function() {
			console.log("answers has been sent");
		};
		
	}]);

angular.module('EvalClient').controller('AdminController', 
	['$scope', '$location', '$rootScope', '$routeParams', '$http', 'TokenResource','TemplateResource',
	function ($scope, $location, $rootScope, $routeParams, $http, TokenResource, TemplateResource){

		$scope.courseQ = [];
		$scope.teachQ = [];
		$scope.answers = [];
		$scope.answerOption = 1;
		$scope.evaltemparr = [];

		var tokenius = TokenResource.gettoken($routeParams.admin);

		console.log("about to get evaltemplates");
    	$http.defaults.headers.common.Authorization = "Basic " + tokenius;
    	TemplateResource.gettemplates().success(function (response){
    		console.log(response);
    		for(var i in response){
				$scope.evaltemparr.push(response[i]);
			}

    	})
    	.error(function(){
    		console.log("get error");
    	})
		// Datepicker start
		var nowTemp = new Date();
		var now = new Date(nowTemp.getFullYear(), nowTemp.getMonth(), nowTemp.getDate(), 0, 0, 0, 0);
		 
		var checkin = $('#dpd1').datepicker({
		  onRender: function(date) {
		    return date.valueOf() < now.valueOf() ? 'disabled' : '';
		  }
		}).on('changeDate', function(ev) {
		  if (ev.date.valueOf() > checkout.date.valueOf()) {
		    var newDate = new Date(ev.date)
		    newDate.setDate(newDate.getDate() + 1);
		    checkout.setValue(newDate);
		  }
		  checkin.hide();
		  $('#dpd2')[0].focus();
		}).data('datepicker');
		var checkout = $('#dpd2').datepicker({
		  onRender: function(date) {
		    return date.valueOf() <= checkin.date.valueOf() ? 'disabled' : '';
		  }
		}).on('changeDate', function(ev) {
		  checkout.hide();
		}).data('datepicker');
		// Datepicker end

		$scope.text = function() {
			$scope.answerOption = 1;
		}
		$scope.single = function() {
			$scope.answerOption = 2;
		}
		$scope.multiple = function() {
			$scope.answerOption = 3;
		}

		$("#menu-toggle").click(function(e) {
        	e.preventDefault();
        	$("#wrapper").toggleClass("toggled");
    	});
		console.log("Name " + $scope.tName);
		console.log("Intro " + $scope.intro);

		$scope.addQuestion = function() {
			var type = "";
			if($scope.answerOption === 1){
				type = "text";
				$scope.quest = {
	    			//ID: 1,
				  	Text: $scope.Qestion,
				  	TextEN: $scope.Qestion,
				  	//ImageURL: "none",
				  	Type: type
	    		};

			}else if($scope.answerOption === 2 || $scope.answerOption === 3){
				if($scope.answerOption === 2){
					type = "single";
				}else{
					type = "multiple";
				}
				
				$scope.ans1 = {
					//ID: 1,
			        Text: $scope.Answer1,
			        TextEN: $scope.Answer1,
			        //ImageURL: "none",
			        Weight: 1
				};
				$scope.answers.push($scope.ans1);
				$scope.ans2 = {
					//ID: 1,
			        Text: $scope.Answer2,
			        TextEN: $scope.Answer2,
			        //ImageURL: "none",
			        Weight: 2
				};
				$scope.answers.push($scope.ans2);
				$scope.ans3 = {
					//ID: 1,
			        Text: $scope.Answer3,
			        TextEN: $scope.Answer3,
			        //ImageURL: "none",
			        Weight: 3
				};
				$scope.answers.push($scope.ans3);
				$scope.ans4 = {
					//ID: 1,
			        Text: $scope.Answer4,
			        TextEN: $scope.Answer4,
			        //ImageURL: "none",
			        Weight: 4
				};
				$scope.answers.push($scope.ans4);
				$scope.ans5 = {
					//ID: 1,
			        Text: $scope.Answer5,
			        TextEN: $scope.Answer5,
			        //ImageURL: "none",
			        Weight: 5
				};
				$scope.answers.push($scope.ans5);
				$('#Answer1').val('');
				$('#Answer2').val('');
				$('#Answer3').val('');
				$('#Answer4').val('');
				$('#Answer5').val('');

				var a = $scope.answers.slice();
				$scope.quest = {
	    			//ID: 1,
				  	Text: $scope.Qestion,
				  	TextEN: $scope.Qestion,
				  	//ImageURL: "none",
				  	Type: type,
				  	Answers: a
	    		};
	    		$scope.answers.length = 0;
			}

			$('#Qestion').val('');

			if (document.getElementById('course').checked) {
				$scope.courseQ.push($scope.quest);
				console.log("courseQ.length: " + $scope.courseQ.length);
			}else if(document.getElementById('teacher').checked){
				$scope.teachQ.push($scope.quest);
				console.log("teachQ.length: " + $scope.teachQ.length);
			}
		};
		//var template = {};
    	$scope.createTemplate = function() {
    		console.log("Name: " + $scope.tName);
    		console.log("courseQ.length: " + $scope.courseQ.length);
    		var cQ = $scope.courseQ.slice();
    		var tQ = $scope.teachQ.slice();
    		$scope.template = {
    			//ID: 1,
			  	Title: $scope.tName,
			  	TitleEN: $scope.tName,
			  	IntroText: $scope.intro,
			  	IntroTextEN: $scope.intro,
    			CourseQuestions: cQ,
    			TeacherQuestions: tQ
    		};

    		if($scope.template.CourseQuestions.length === 0 && $scope.template.TeacherQuestions.length === 0){
    			console.log("error");
    			console.log($scope.template);
    		}else{
    			// Create template
    			console.log("ekki error");
    			console.log($scope.template);

    			
    			//console.log("Er admin " + $routeParams.admin + " ?");
				//console.log("tokenius: " + tokenius);

				/*token to send with request*/
				$http.defaults.headers.common.Authorization = "Basic " + tokenius;
    			$http.post("http://dispatch.ru.is/h33/api/v1/evaluationtemplates", $scope.template).success(function (){
    				console.log("template hefur verid sent a server");
    				
    				TemplateResource.gettemplates().success(function (response){
    					$scope.evaltemparr.length = 0;
    					for(var i in response){

							$scope.evaltemparr.push(response[i]);
						}
    				})
    				.error(function (){
    					console.log("update error on templates");
    				});
    			})
    			$scope.courseQ.length = 0;
    			$scope.teachQ.length = 0;
    		}	
    	};

    	$scope.postEval = function() {
    		var start = $('#dpd1').datepicker('getDate');
			var end = $('#dpd2').datepicker('getDate');
			if(start !== undefined && end !== undefined && $scope.tempID !== undefined){
				console.log(start.toISOString() + " -- " + end.toISOString());
				$scope.eval ={
					TemplateID: $scope.tempID,
					StartDate: start.toISOString(),
					EndDate: end.toISOString()
				};
				$http.post("http://dispatch.ru.is/h33/api/v1/evaluations", $scope.eval).success(function (){
					console.log("template has been sent");
				})
			}
    	};


	}]);















