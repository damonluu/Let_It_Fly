		// create the module and name it scotchApp
	var myApp = angular.module('myApp', ['ngRoute']);
	// configure our routes
	myApp.config(function($routeProvider) {
		$routeProvider

			// route for the home page
			.when('/', {
				templateUrl : 'pages/home.html',
				controller  : 'mainController'
			})
			// route for the about page
			.when('/signup', {
				templateUrl : 'pages/signup.html',
				controller  : 'aboutController'
			})

			.when('/signin', {
				templateUrl : 'pages/signin.html',
				controller : 'aboutController'
			})
	});
	// create the controller and inject Angular's $scope
	myApp.controller('mainController', function($scope, $rootScope) {
		// create a message to display in our view
		$scope.message = 'Sign Up';

	});

	myApp.controller('aboutController', function($scope) {
		$scope.message = 'Sign In';
	});

	myApp.controller('contactController', function($scope) {
		$scope.message = 'Contact us! JK. This is just a demo.';
	});
	$locationProvider.html5Mode(true);