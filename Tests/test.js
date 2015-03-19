/*describe("An AngularJS test suite", function(){
	it('should have tests', function(){
		expect(true).toBe(true);
	});
});*/

describe('LoginController', function (){
	beforeEach(module('ngRoute'));

	var $conroller;
	beforeEach(inject(function(_$controller_){
		$controller = _$controller_;
	}));

	it('should inject dependencies', inject(function ($routeProvider){
		expect($routeProvider).toBeDefined();
	}))
})
























































