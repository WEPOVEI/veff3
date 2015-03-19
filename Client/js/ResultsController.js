angular.module('EvalClient').controller('ResultsController',['$scope', '$location', '$http', '$rootScope', '$routeParams','$timeout' ,'EvaluationResource', 'TokenResource', 
	function ($scope, $location, $http, $rootScope, $routeParams, $timeout, EvaluationResource, TokenResource){

	$scope.theid = $rootScope.resultID;

	EvaluationResource.getevaluationresult($scope.theid).success(function (response) {

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
		console.log("results err");
	});
}]);