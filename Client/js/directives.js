angular.module('direct', []).directive('myDomDirective', function() {
     return {
       link: function($scope, element, attrs) {

        element.bind('mouseenter', function() {
           element.css('background-color', '#fcf8e3');
        });

        element.bind('mouseleave', function() {
           element.css('background-color', 'white');
        });
      }
      /*restrict: 'E',
      scope: {
      	item: "="
      },
      template: "<td>asd</td>", //"<td>{{item.CourseID}}</td> <td>{{item.Name}}</td> <td>{{item.NameEN}}</td>",
      controller: function($scope) {
      	console.log($scope.item);
      }*/
    };
  });
