var dashboard = angular.module('dashboard', ['formApp', 'ngRoute']);

dashboard.config(function($routeProvider) {
  $routeProvider
    .when('/profile:id', {
      templateUrl: 'pages/dashboard/profile.html',
      controller: 'ProfileController'
    })
    .when('/pastride:id', {
      templateUrl: 'pages/dashboard/pastride.html',
      controller: 'PastrideController'
    })
    .when('/userID:id', {
      templateUrl: 'pages/dashboard/homepage.html',
    })
    .when('/service:id', {
      templateUrl: 'pages/dashboard/service.html',
      controller: 'ServiceController'
    })
    .otherwise({
      redirectTo: '/userID:id',
      templateUrl: 'pages/dashboard/homepage.html',
    });
});
dashboard.factory('Data', function() {
  var data = {
    id: '',
    firstName: '',
    lastName: '',
    email: '',
    role: '',
  };
  return {
    getData: function() {
      return data;
    },
    setData: function(newId, first, last, email, role) {
      data.id = newId;
      data.firstName = first;
      data.lastName = last;
      data.email = email;
      data.role = role;
    }
  };
})

dashboard.controller('HomepageController', function($scope, $location, $routeParams, $http, $timeout, Data) {
  var first = true;

  $timeout(function() {
    var str = $routeParams.id;
    if (!!str) {
      str = str.slice(1);
    }
    if (str != undefined) {
      console.log(str);
      if (first) {
        var a = document.getElementById('sidebar').getElementsByTagName('a'),
          length = a.length;
        var dropdown = document.getElementById('navbarResponsive').getElementsByTagName('a');
        var buttonRequest = document.getElementById('linkRequest');
        for (var i = 0; i < length; i++) {
          a[i].href += $routeParams.id;
          dropdown[i].href += $routeParams.id;
          console.log(dropdown[i].href);
          console.log(a[i].href);
        }
        dropdown[3].href += $routeParams.id;
        buttonRequest.href += $routeParams.id;
        first = false;
      }
      $scope.setUpName($scope, str);
    }
  }, 50);
  $scope.setUpName = function($scope, userID) {
    $scope.name = "";
    console.log(userID);
    $http({
      url: '/getID',
      method: 'GET',
      params: {
        id: userID
      }
    }).then(function(response) {
      console.log("posted successfully");
      Data.setData(userID, response.data[0].firstName, response.data[0].lastName, response.data[0].email, response.data[0].rider);
      console.log(Data.getData());
      $scope.name = response.data[0].firstName + " " + response.data[0].lastName;
      $scope.password = response.data[0].password;
      $scope.phonenumber = response.data[0].phoneNumber;
      $scope.email = response.data[0].email;
      if (response.data[0].rider == 1) {
        $scope.role = "Rider";
        $scope.function = "REQUEST RIDE";
        $scope.serviceTitle = " Rider Mode: " + Data.getData().firstName;
      } else {
        $scope.role = "Driver";
        $scope.function = "START DRIVING";
        $scope.serviceTitle = " Driver Mode:  " + Data.getData().firstName;
      }
    }).catch(function(response) {
      console.log("Error when getting user's information");
    })
  };
});

dashboard.controller('ProfileController', function($scope, $http, Data, $timeout) {
  $timeout(function() {
    $scope.setUpPayment($scope, Data.getData().id);
    console.log(Data.getData().id);
  }, 50);
  $scope.setUpPayment = function($scope, userID) {
    console.log(userID);
    $http({
      url: '/getPayment',
      method: 'GET',
      params: {
        id: userID
      }
    }).then(function(response) {
      console.log(response.data[0]);
      $scope.type = response.data[0].type;
      num = response.data[0].cardNum.toString();
      $scope.cardnumber = "xxxx-xxxx-xxxx-" + num.slice(11, 15);
      $scope.month = response.data[0].expMonth;
      $scope.year = response.data[0].expYear;
      $scope.cardholder = response.data[0].name;

    }).catch(function(response) {
      console.log("something is wrong");
    })
  };

});


dashboard.controller('ServiceController', function($scope, $http, Data, $timeout) {
  $timeout(function() {
    if ($scope.role == "Driver") {
      $("#siteloader").html('<object data="http://localhost:1600/drivermap.html">');
    } else {
      $("#siteloader").html('<object data="http://localhost:1600/ridermap.html">');
    }
  }, 100);
});

dashboard.controller('PastrideController', function($scope, $http, Data, $timeout) {
  // $timeout(function() {
  //   $scope.getPastRides($scope, Data.getData().id, $scope.role);
  //   console.log(Data.getData().id);
  // }, 200);
  //  $scope.getPastRides = function($scope, userID, role) {
  //   console.log(userID);
  //   $http({
  //     url: '/getPastrides' + role,
  //     method: 'GET',
  //     params: {
  //       id: userID
  //     }
  //   }).then(function(response) {
  //     console.log(response.data[0]);
  //     console.log(response.data.length);
  //      $.ajax({
  //       url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + response.data[0].start_lat + ',' + response.data[0].start_long + '&key=AIzaSyDNIMuefOw8IFBBjGifWHAMMuSKOC7epj0',
  //       method: 'POST',
  //       success: function(result, status) {
  //         var address = result.results[0].formatted_address;
  //         alert(address);
  //         $scope.startAddress = address;
  //         // console.log(status + " : " + result.results[0].formatted_address);
  //       }
  //     });
  //   }).catch(function(response) {
  //     console.log("something is wrong");
  //   })
  // };
});
