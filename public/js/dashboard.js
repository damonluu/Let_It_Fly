var dashboard = angular.module('dashboard', ['ngRoute']);

dashboard.config(function($routeProvider) {
		$routeProvider
			.when('/profile', {
				templateUrl : 'pages/dashboard/profile.html',
			})
			.when('/currentride', {
				templateUrl : 'pages/dashboard/currentride.html',
			})
			.when('/pastride', {
				templateUrl : 'pages/dashboard/pastride.html',
			})
			.otherwise({
              redirectTo: '/',
              templateUrl: 'pages/dashboard/homepage.html',
            });
			/*.when('/dashboard',{
				templateUrl : 'pages/dashboard.html',
				controller : 'DashboardController'
			})*/
});