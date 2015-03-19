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
			for(var i in response){
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
				console.log("error");
			});
		};

		$scope.submitAns = [];
		$scope.submitAnswer = function (question) {
			var answer = 0;
			var questID;
			if(question.Type === "text"){
				var str = "#a" + question.ID;
				var text = $(str).val();
				answer = text;
			}else {
				// Mutliple will get the value of the last answer, because the API
				// does not support it yet.
				if (document.getElementById("a" + question.Answers[0].ID).checked) {
					questID = question.Answers[0].ID;
					answer = 5;
				}if(document.getElementById("b" + question.Answers[1].ID).checked){
					questID = question.Answers[1].ID;
					answer = 4;
				}if(document.getElementById("c" + question.Answers[2].ID).checked){
					questID = question.Answers[2].ID;
					answer = 3;
				}if(document.getElementById("d" + question.Answers[3].ID).checked){
					questID = question.Answers[3].ID;
					answer = 2;
				}if(document.getElementById("e" + question.Answers[4].ID).checked){
					questID = question.Answers[4].ID;
					answer = 1;
				}
			}
			if(answer !== "0" && answer !== ""){
				$scope.answerTemplate = {
					QuestionID: questID, //question.ID,
					//TeacherSSN: ,
					Value: answer
				};
				$scope.submitAns.push($scope.answerTemplate);
			}else {
				console.log("error");
			}
		};
		
		$scope.postAnswers = function() {
			var arr = CourseResource.getinfo();
			// Send answers to the API
			CourseResource.postevaluation(arr[0], arr[1], arr[2], $scope.submitAns).success(function() {
			});
			$scope.courseQuest.length = 0;
			$scope.teachQuest.length = 0;
			//$scope.submitAns.length = 0;
		};
	}]);