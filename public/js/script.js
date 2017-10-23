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
	});
	// create the controller and inject Angular's $scope
	myApp.controller('mainController', function($scope, $rootScope) {
		// create a message to display in our view
		$scope.message = 'Sign Up';

	});

	myApp.controller('SignUpController', function($scope, $http) {
		$scope.create = function(user){
			console.log(user);
			var regexPhone = /\d{10}/;
			var regexEmail = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
			if(regexPhone.test(user.phoneNumber) && regexEmail.test(user.email)){
				$http.post('/user',user).
		        then(function(response) {
		            console.log("posted successfully");
		        }).catch(function(response) {
		            console.error("error in posting");
		        })
	   		}
		}
	});

	myApp.controller('SignInController', function($scope, $http) {
		$scope.login = function(user){
			console.log(user);
		    $http({
		            url: '/user',
		            method: 'GET',
		            params: user
		        }). then(function(response) {
		            console.log("posted successfully");
		        }).catch(function(error) {
		            console.log("Invalid Password or Email")
		        })
		}
	});
