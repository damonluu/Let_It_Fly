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
				controller  : 'SignUpController'
			})

			.when('/signin', {
				templateUrl : 'pages/signin.html',
				controller : 'SignInController'
			})
			.when('/adduser',{
				templateUrl : 'pages/test.html'
			})
	});
	// create the controller and inject Angular's $scope
	myApp.controller('mainController', function($scope, $rootScope) {
		// create a message to display in our view
		$scope.message = 'Sign Up';

	});

	myApp.controller('SignUpController', function($scope, $http) {
		$scope.create = function(user){
			console.log(user);
			$http.post('/user',user).
	        then(function(response) {
	            console.log("posted successfully");
	        }).catch(function(response) {
	            console.error("error in posting");
	        })
		}
	});

	myApp.controller('SignInController', function($scope) {
		$scope.message = 'Contact us! JK. This is just a demo.';
	});
