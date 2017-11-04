		// create the module and name it scotchApp
	var formApp = angular.module('formApp', ['ngRoute']);
	// configure our routes
	formApp.value('users', {
		id: '',
		firstname: '',
		lastname: '',
		password: '',
		email: '',
		phonenumber: '',
		rider: '',
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
				users.cardholder = user.cardHolder;
				users.cardnumber = user.cardNumber;
				users.month = user.month;
				users.year = user.year;
				users.cvv = user.cvv;
			    $http.post('/checkCard',users).
			         then(function(response) {
			         	 console.log("passed checkCard");
						 window.location.href="../dashboard.html";
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
			if($scope.checkNull(user,6)){
				users.firstname = user.firstName;
				users.lastname = user.lastName;
				users.password = user.password;
				users.phonenumber = user.phoneNumber;
				users.email = user.email;
				if(user.rider === 'driver'){
					users.rider = "FALSE";
				}
				else {
					users.rider = "TRUE";
				}
				$http.post('/user',users).then(function(response) {
				    console.log("created account successfully");
				    users.id = response.data;
				    console.log(users.id);
				    window.location.href="form#/signup2";
				}).catch(function(response) {
					console.log(response.data);
					var popup = document.getElementById("popup");
			        popup.innerHTML = response.data;
			        popup.className = "show";
			        setTimeout(function(){ popup.className = popup.className.replace("show", ""); }, 3000);
				    console.error("error in creating account");
				})
	   		}
	   		console.log(users);
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
		            console.log(response.data);
		            var id = response.data[0].ID;
		            window.location.href="../dashboard#/userID:" + id;
		        }).catch(function(response) {
		        	var popup = document.getElementById("popup");
			        popup.innerHTML = response.data;
			        popup.className = "show";
			        setTimeout(function(){ popup.className = popup.className.replace("show", ""); }, 3000);
		            console.log("Invalid Password or Email")
		        })
		}
	});

	/*myApp.controller('DashboardController', function($scope, $http){
		$scope.
	})*/
