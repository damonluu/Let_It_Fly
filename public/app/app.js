'use strict';

angular.module('myApp', [
  'ngRoute'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'view/main.html',
      })
    $locationProvider.html5Mode(true);
  });
