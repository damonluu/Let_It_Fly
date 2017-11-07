var dashboard = angular.module('dashboard', ['formApp','ngRoute']);

dashboard.config(function($routeProvider) {
		$routeProvider
			.when('/profile:id', {
				templateUrl : 'pages/dashboard/profile.html',
				controller: 'ProfileController'
			})
			.when('/currentride:id', {
				templateUrl : 'pages/dashboard/currentride.html',
			})
			.when('/pastride:id', {
				templateUrl : 'pages/dashboard/pastride.html',
			})
			.when('/userID:id', {
				templateUrl : 'pages/dashboard/homepage.html',
			})
			.otherwise({
              redirectTo: '/userID:id',
              templateUrl: 'pages/dashboard/homepage.html',
            });
});
dashboard.factory('Data',function()	{
	var data = {
		id : '',
		firstName : '',
		lastName : '',
		email : '',
		role : ''
	};
	return {
		getData: function(){
			return data;
		},
		setData: function(newId,first,last,email,role){
			data.id = newId;
			data.firstName = first;
			data.lastName = last;
			data.email = email;
			data.role = role;
		}
	};
})

dashboard.controller('HomepageController', function($scope, $routeParams,$http,$timeout, Data){
		var first = true;
		
		$timeout(function(){
			var str = $routeParams.id;
			if(!! str){
				str = str.slice(1);
			}
			if(str != undefined){
				console.log(str);
				if(first){
					var a = document.getElementById('sidebar').getElementsByTagName('a'),
					length = a.length;
					for(var i = 0; i < length; i++){
						a[i].href += $routeParams.id;
						console.log(a[i].href);
					}
					first = false;
				}
				$scope.setUpName($scope,str);
			}
		},50);

		$scope.setUpName = function($scope, userID){
			$scope.name = "";
			console.log(userID);
			$http({
	    	url: '/getID',
            method: 'GET',
            params: { id : userID }
	        }).then(function(response) {
	            console.log("posted successfully");
	            Data.setData(userID, response.data[0].firstName, response.data[0].lastName, response.data[0].email, response.data[0].rider);
	            console.log(Data.getData());
	            $scope.name = response.data[0].firstName + " " + response.data[0].lastName;
	            $scope.email = response.data[0].email;
	            if(response.data[0].rider == 1){
	            	$scope.role = "Driver";
	            }
	            else $scope.role = "Rider";
	        }).catch(function(response) {
	        	console.log("something is wrong");
	        })
		};
	});

dashboard.controller('ProfileController', function($scope, $http, Data){
	
});

$scope.requestRide = function(){
	console.log("requestRide button clicked");
       window.location = "dashboard#/currentride:id";
 }
