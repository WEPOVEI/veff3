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
				if(tokenArray[i].user === user){					
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

		$scope.evalTitle = '';
		$scope.evaltitleEN = '';
		$scope.courseQuest = [];
		$scope.teachQuest = [];
		$scope.ansType = '';
		//$scope.
		$scope.geteval = function(courseid, semester, id) {
			$scope.courseQuest.length = 0;
			$scope.teachQuest.length = 0;
			console.log(courseid);
			console.log(semester);
			console.log(id);
			$http.get("http://dispatch.ru.is/h33/api/v1/courses/" + courseid + "/" + semester + "/" + "evaluations/" + id)
			.success(function (response){
				$scope.evalTitle =  response["Title"];
				$scope.evaltitleEN = response["TitleEN"];
				
				var s = response["CourseQuestions"];
				for (var key in s) {
			   		var obj = s[key];
			   		
			   		$scope.courseQuest.push(obj);
				}
				var t = response["TeacherQuestions"];
				for (var key in t) {
					var obj = t[key];

					$scope.teachQuest.push(obj);
				}
			})
			.error(function (){
				console.log("vesen");
			});
		};

		$scope.postAnswers = function() {
			console.log("answers has been sent");
			$scope.courseQuest.length = 0;
			$scope.teachQuest.length = 0;
		};

		$scope.submitAnswer = function (question) {
			console.log("->");
			console.log(question);
			var answer = "0";
			if(question.Type === "text"){
				var str = "#a" + question.ID;
				console.log("string: " + str);
				var text = $(str).val();
				console.log("text: " + text);
				answer = text;
			}else {
				// Mutliple will get the value of the last answer, because the API
				// does not support it yet.
				console.log("->");
				console.log("a" + question.Answers[0].Text);
				if (document.getElementById("a" + question.Answers[0].ID).checked) {
					answer = "5";
				}if(document.getElementById("b" + question.Answers[1].ID).checked){
					answer = "4";
				}if(document.getElementById("c" + question.Answers[2].ID).checked){
					answer = "3";
				}if(document.getElementById("d" + question.Answers[3].ID).checked){
					answer = "2";
				}if(document.getElementById("e" + question.Answers[4].ID).checked){
					answer = "1";
				}
			}
			console.log("answer: " + answer);
			if(answer !== "0"){
				console.log("lets send");
			}else {
				console.log("errno");
			}
			
			


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

		$scope.pic = '';

		$scope.addQuestion = function() {
			var type = "";
			if($scope.answerOption === 1){
				type = "text";
				$scope.quest = {
	    			//ID: 1,
				  	Text: $scope.Qestion,
				  	TextEN: $scope.QestionEN,
				  	ImageURL: $scope.pic,
				  	Type: type
	    		};

			}else if($scope.answerOption === 2 || $scope.answerOption === 3){
				if($scope.answerOption === 2){
					type = "single";
				}else{
					type = "multiple";
				}
				
				$scope.ans1 = {
			        Text: $scope.Answer1,
			        TextEN: $scope.Answer1,
			        ImageURL: $scope.pic,
			        Weight: 5
				};

				$scope.answers.push($scope.ans1);
				$scope.ans2 = {
			        Text: $scope.Answer2,
			        TextEN: $scope.Answer2,
			        ImageURL: $scope.pic,
			        Weight: 4
				};
				$scope.answers.push($scope.ans2);
				$scope.ans3 = {
			        Text: $scope.Answer3,
			        TextEN: $scope.Answer3,
			        ImageURL: $scope.pic,
			        Weight: 3
				};
				$scope.answers.push($scope.ans3);
				$scope.ans4 = {
			        Text: $scope.Answer4,
			        TextEN: $scope.Answer4,
			        ImageURL: $scope.pic,
			        Weight: 2
				};
				$scope.answers.push($scope.ans4);
				$scope.ans5 = {
			        Text: $scope.Answer5,
			        TextEN: $scope.Answer5,
			        Weight: 1
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
				  	ImageURL: $scope.pic,
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
			  	TitleEN: $scope.tNameEN,
			  	IntroText: $scope.intro,
			  	IntroTextEN: $scope.introEN,
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

				/*token to send with request*/
				$http.defaults.headers.common.Authorization = "Basic " + tokenius;
    			$http.post("http://dispatch.ru.is/h33/api/v1/evaluationtemplates", $scope.template).success(function (){
    				console.log("template hefur verid sent a server");
    				
    				TemplateResource.gettemplates().success(function (response){
    					$scope.evaltemparr.length = 0;
    					$('#tName').val('');
    					$('#tNameEN').val('');
    					$('#intro').val('');
    					$('#introEN').val('');

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















