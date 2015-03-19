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
			tokenArray.push(tokendetails);
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

angular.module('EvalClient').factory('MyResource', ['$http', 'SERVER_URL', function ($http, SERVER_URL){
	return{
		getmycourses: function(){
			return $http.get(SERVER_URL + "my" + "/courses");
		},
		getmyevaluations: function (){
			return $http.get(SERVER_URL + "my" + "/evaluations");
		}
	}
}]);

angular.module('EvalClient').factory('CourseResource', ['$http', 'SERVER_URL', function ($http, SERVER_URL){
	var courseArray = [];

	return{
		storeinfo: function(courseid, semester, id){
			courseArray.length = 0;
			courseArray.push(courseid);
			courseArray.push(semester);
			courseArray.push(id);
		},
		getinfo: function(){
			return courseArray;
		},
		getcourseeval: function(courseid, semester, id){
			return $http.get(SERVER_URL + "courses/" + courseid + "/" + semester + "/" + "evaluations/" + id);
		},
		postevaluation: function (courseid, semester, id, ans){
			return $http.post(SERVER_URL + "courses/" + courseid + "/" + semester + "/" + "evaluations/" + id, ans);
		}
	}
}]);

angular.module('EvalClient').factory('TemplateResource', ['$http', 'SERVER_URL', function ($http, SERVER_URL){

	return{
		gettemplates: function(){
			return $http.get(SERVER_URL + "evaluationtemplates");
			
		},
		posttemplate: function (template){
			return $http.post(SERVER_URL + "evaluationtemplates", template);
		}
	}
}]);
angular.module('EvalClient').factory('EvaluationResource', ['$http', 'SERVER_URL', function ($http, SERVER_URL){

	return{
		getevaluations: function(){
			return $http.get(SERVER_URL + "evaluations");
		},
		postevaluation: function(eval){
			return $http.post(SERVER_URL + "evaluations", eval);

		},
		getevaluationresult: function(id){
			return $http.get(SERVER_URL + "evaluations/" + id);
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
			.when('/results/', {templateUrl: 'views/results.html', controller: 'ResultsController'})
			.otherwise({
	  			redirectTo: '/login'
			});

	}
]);
angular.module('EvalClient').controller('ResultsController',['$scope', '$location', '$http', '$rootScope', '$routeParams','$timeout' ,'EvaluationResource', 'TokenResource', 
	function ($scope, $location, $http, $rootScope, $routeParams, $timeout, EvaluationResource, TokenResource){

	console.log("here");
	$scope.theid = $rootScope.resultID;
	console.log($scope.theid);

	//var tokenius = TokenResource.gettoken($routeParams.user);
	//$http.defaults.headers.common.Authorization = "Basic " + tokenius;

	EvaluationResource.getevaluationresult($scope.theid).success(function (response) {
		console.log("HIIIIIIIII");
		console.log(response);

		var chart = new CanvasJS.Chart("chartContainer", {
			theme: "theme2",//theme1
			title:{
				text: response.TemplateTitle            
			},
			animationEnabled: false,   // change to true
			data: [              
			{
				// Change type to "bar", "splineArea", "area", "spline", "pie",etc.
				type: "column",
				dataPoints: [
					{ label: "Gervigreind",  y: 10  },
					{ label: "Vefforritun II", y: 15  },
					{ label: "Forritunarmál", y: 25  },
					{ label: "Stýrikerfi",  y: 30  },
				]
			}
			]
		});
		chart.render();

	})
	.error(function (){
		console.log("EN ERROR");
	});
}]);

angular.module('EvalClient').controller('LoginController',
	['$scope', '$location', '$rootScope', '$routeParams', '$http', 'LoginResource', 'TokenResource',
	function ($scope, $location, $rootScope, $routeParams, $http, LoginResource,TokenResource){
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
	['$scope', '$location', '$rootScope', '$routeParams', '$http','TokenResource', 'MyResource', 'CourseResource',
	function ($scope, $location, $rootScope, $routeParams, $http, TokenResource, MyResource, CourseResource){
		$scope.courseobjarr = [];
		$scope.currentuser = $routeParams.user;
		$scope.evalarr = [];
		var tokenius = TokenResource.gettoken($routeParams.user);

		/*token to send with request*/
		$http.defaults.headers.common.Authorization = "Basic " + tokenius;

		/* get all courses from api and push course objects into array for later usage*/
		MyResource.getmycourses().success(function (response){

			for(var i in response){
				$scope.courseobjarr.push(response[i]);
			}
		})
		.error(function(error){
			console.log("fail course api");
		});

		MyResource.getmyevaluations().success(function (response){
			console.log("factory works")
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

			//vinna her
			CourseResource.storeinfo(courseid, semester, id);

			/*Get ready evaluations for student to answer*/
			CourseResource.getcourseeval(courseid, semester, id)
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

		$scope.submitAns = [];
		$scope.submitAnswer = function (question) {
			console.log("->");
			console.log(question);
			var answer = 0;
			var questID;
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
					console.log("Quest ID: " + question.Answers[0].ID);
					questID = question.Answers[0].ID;
					answer = 5;
				}if(document.getElementById("b" + question.Answers[1].ID).checked){
					console.log("Quest ID: " + question.Answers[1].ID);
					questID = question.Answers[1].ID;
					answer = 4;
				}if(document.getElementById("c" + question.Answers[2].ID).checked){
					console.log("Quest ID: " + question.Answers[2].ID);
					questID = question.Answers[2].ID;
					answer = 3;
				}if(document.getElementById("d" + question.Answers[3].ID).checked){
					console.log("Quest ID: " + question.Answers[3].ID);
					questID = question.Answers[3].ID;
					answer = 2;
				}if(document.getElementById("e" + question.Answers[4].ID).checked){
					console.log("Quest ID: " + question.Answers[4].ID);
					questID = question.Answers[4].ID;
					answer = 1;
				}
			}
			console.log("answer: " + answer);
			if(answer !== "0" && answer !== ""){
				$scope.answerTemplate = {
					QuestionID: questID, //question.ID,
					//TeacherSSN: ,
					Value: answer
				};
				$scope.submitAns.push($scope.answerTemplate);
				console.log("lets send");
			}else {
				console.log("errno");
			}
		};
		
		$scope.postAnswers = function() {
			console.log($scope.submitAns);
			console.log("answers has been sent");
			var arr = CourseResource.getinfo();
			console.log(arr);
			// Send answers to the API
			console.log("---->");
			console.log($scope.submitAns);
			CourseResource.postevaluation(arr[0], arr[1], arr[2], $scope.submitAns).success(function() {
				console.log("SUCCESS!!!");
			});
			$scope.courseQuest.length = 0;
			$scope.teachQuest.length = 0;
			//$scope.submitAns.length = 0;
		};
	}]);

angular.module('EvalClient').controller('AdminController', 
	['$scope', '$location', '$rootScope', '$routeParams', '$http', 'TokenResource','TemplateResource', 'EvaluationResource',
	function ($scope, $location, $rootScope, $routeParams, $http, TokenResource, TemplateResource, EvaluationResource){

		$scope.courseQ = [];
		$scope.teachQ = [];
		$scope.answers = [];
		$scope.answerOption = 1;
		$scope.evaltemparr = [];
		$scope.openEvals = [];

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

    	EvaluationResource.getevaluations().success(function (response){
    		for(var i in response){
    			if(response[i].Status === "open"){
    				$scope.openEvals.push(response[i]);
    			}
			}
			console.log("----->");
    		console.log($scope.openEvals);
    	})
    	.error(function(){
    		console.log("BLESS");
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
				/* send template to the server */
    			TemplateResource.posttemplate($scope.template).success(function (){
    				console.log("template hefur verid sent a server");
    				
    				/*small hax to get the list of templates to update on admin.html*/
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

				/* post a specific evaluation to server, these are the templates that users will eventually see*/
				EvaluationResource.postevaluation($scope.eval).success(function (response){
					console.log("template has been sent");
				})
				.error(function (){
					console.log("evaluationresource error");
				});
			}
    	};
    	console.log("routeparams = " + $routeParams);
    	console.log("location = " + $location);
    	$scope.results = function(ID){
    		console.log("ID: " + ID);
    		$rootScope.resultID = ID;
    		$location.path('/results/');

    	};

	}]);















