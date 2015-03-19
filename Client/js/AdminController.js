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

		
    	$http.defaults.headers.common.Authorization = "Basic " + tokenius;
    	TemplateResource.gettemplates().success(function (response){
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
    	})
    	.error(function(){
    		console.log("error");
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
			}else if(document.getElementById('teacher').checked){
				$scope.teachQ.push($scope.quest);
			}
		};
		//var template = {};
    	$scope.createTemplate = function() {
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
    		}else{
    			// Create template

				/*token to send with request*/
				$http.defaults.headers.common.Authorization = "Basic " + tokenius;
				/* send template to the server */
    			TemplateResource.posttemplate($scope.template).success(function (){
    				
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
				$scope.eval ={
					TemplateID: $scope.tempID,
					StartDate: start.toISOString(),
					EndDate: end.toISOString()
				};

				/* post a specific evaluation to server, these are the templates that users will eventually see*/
				EvaluationResource.postevaluation($scope.eval).success(function (response){
				})
				.error(function (){
					console.log("evaluationresource error");
				});
			}
    	};
    	$scope.results = function(ID){
    		$rootScope.resultID = ID;
    		$location.path('/results/');

    	};

	}]);