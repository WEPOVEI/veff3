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