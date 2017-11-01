	// create the module and name it scotchApp
	var formApp = angular.module('formApp', ['ngRoute']);
	// configure our routes
	formApp.value('users', {
		firstname: '',
		lastname: '',
		password: '',
		email: '',
		phonenumber: '',
		role: '',
		cardholder: '',
		cardnumber: '',
		cvv: '',
		month: '',
		year: ''
	});
	formApp.config(function($routeProvider) {
		$routeProvider
			// route for the about page

			.when('/signin', {
				templateUrl : 'pages/signin.html',
				controller  : 'SignInController'
			})

			.when('/signup2', {
				templateUrl : 'pages/signup2.html',
				controller : 'SignUpController'
			})
			.otherwise({
              redirectTo: '/',
              templateUrl: 'pages/signup1.html',
              controller: 'SignUpController'
            });
	});
	formApp.controller('SignUpController', ['$scope','users','$http',function($scope, users, $http) {
		$scope.checkNull = function(input, size) { 
			var count = 0;
			for(var property in input){
				if(input.hasOwnProperty(property)){
					console.log(input[property]);
					count++;
				}
			}
			return count == size;
		}

		$scope.processForm = function(user) {
			console.log(user);
			if($scope.checkNull(user,5)){
			    $http.post('/checkCard',user).
			         then(function(response) {
			         	 console.log("passed checkCard");
				         users.cardholder = user.cardHolder;
						 users.cardnumber = user.cardNumber;
						 users.month = user.month;
						 users.year = user.year;
						 users.cvv = user.cvv;
						 window.location.href="../dashboard.html";
						 $http.post('/user',users).then(function(response) {
				            console.log("created account successfully");
				           
				         }).catch(function(response) {
				            console.error("error in creating account");
				         })
			         }).catch(function(response) {
			         	 console.log(response.data);
			         	 var popup = document.getElementById("popup");
			         	 popup.innerHTML = response.data;
			         	 popup.className = "show";
			         	 setTimeout(function(){ popup.className = popup.className.replace("show", ""); }, 3000);
			             console.error("error in posting");
			         })
		    }
		    else { console.log('missing info'); }
		};

		$scope.save = function(user){
			console.log(user);
			if($scope.checkNull(user,5)){
				users.firstname = user.firstName;
				users.lastname = user.lastName;
				users.password = user.password;
				users.phonenumber = user.phoneNumber;
				users.email = user.email;
				window.location.href="form#/signup2";
	   		}
	   		console.log("next step");
		}
	}]);

	formApp.controller('SignInController', function($scope, $http) {
		$scope.login = function(user){
			console.log(user);
		    $http({
		            url: '/user',
		            method: 'GET',
		            params: user
		        }). then(function(response) {
		            console.log("posted successfully");
		            window.location.href="../dashboard.html";
		        }).catch(function(error) {
		            console.log("Invalid Password or Email")
		        })
		}
	});

	/*myApp.controller('DashboardController', function($scope, $http){
		$scope.
	})*/
