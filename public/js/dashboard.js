var dashboard = angular.module('dashboard', ['ngRoute']);

dashboard.config(function($routeProvider) {
		$routeProvider
			// .when('/:userID'){
			// 	templateUrl: 'pages/dashboard/homepage.html'
			// 	//controller: 'UserController'
			// }
			.when('/profile', {
				templateUrl : 'pages/dashboard/profile.html',
			})
			.when('/currentride', {
				templateUrl : 'pages/dashboard/currentride.html',
			})
			.when('/pastride', {
				templateUrl : 'pages/dashboard/pastride.html',
			})
			.when('/userID:id', {
				templateUrl : 'pages/dashboard/homepage.html',
			})
			.otherwise({
              redirectTo: '/userID:id',
              templateUrl: 'pages/dashboard/homepage.html',
            });
			/*.when('/dashboard',{
				templateUrl : 'pages/dashboard.html',
				controller : 'DashboardController'
			})*/
});

