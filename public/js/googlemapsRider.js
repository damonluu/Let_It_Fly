var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer();
var originPID;
var destinationPID;
var directionResponse;
var riderOriginLat;
var riderOriginLng;
var riderDestLat;
var riderDestLng;
var durationMinutes;
var riderIdFromURL = parent.document.URL.substring(parent.document.URL.lastIndexOf(':') + 1);
var d = new Date();
var totalPrice;
var theDriverId;
var requestSeats;

function AutocompleteDirectionsHandler(map) {

  this.map = map;
  this.originPlaceId = null;
  this.destinationPlaceId = null;
  this.travelMode = 'DRIVING';
  var originInput = document.getElementById('origin-input');
  var destinationInput = document.getElementById('destination-input');
  var seatInput = document.getElementById('rider-seat-input');
  var submitButton = document.getElementById('submit-button');
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directionsPanel'));

  var originAutocomplete = new google.maps.places.Autocomplete(
    originInput, {
      placeIdOnly: true
    });
  var destinationAutocomplete = new google.maps.places.Autocomplete(
    destinationInput, {
      placeIdOnly: true
    });

  submitButton.onclick = function() {
    var checkInput1 = document.getElementById("origin-input").value;
    var checkInput2 = document.getElementById("destination-input").value;
    var checkSeatInput = document.getElementById("rider-seat-input").value;
    if (checkInput1 == "" || checkInput1.length == 0 || checkInput1 == null || checkInput2 == "" || checkInput2.length == 0 || checkInput2 == null) {
      alert("Please enter your location first");
    } else if (checkSeatInput == "" || checkSeatInput.length == 0) {
      alert("Please enter the number of seats in your shuttle")
    } else if (!checkSeatInput.match(/\d+/)) {
      alert("Please enter digits for the number of seats required");
    } else if (checkSeatInput <= 0) {
      alert("Good luck finding a car with no seats");
    } else {
      requestSeats = checkSeatInput;
      var promise = calculateAndDisplayRoute();
      promise.then(function(result) {
        var riderInfo = {
          'riderID': riderIdFromURL,
          'riderLat': riderOriginLat,
          'riderLng': riderOriginLng,
          'destinationLat': riderDestLat,
          'destinationLng': riderDestLng,
          'seats': checkSeatInput
        };
        searchDriver(riderInfo);
      });
    }
  };

  this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
  this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');


  this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(originInput);
  this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(destinationInput);
  this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(seatInput);
  this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(submitButton);

}

// this function is used for making the modal box appear to show how far the closest driver is, estimate their arrival time
function displayModal(closestDriver) {
  document.getElementById("driverMinutesAway").setAttribute("class", "");
  document.getElementById("driverMinutesAway").innerHTML = "Closest Driver is " + closestDriver.closestDriverMinutes + " minutes away";
  document.getElementById("estimateDriverArrival").innerHTML = "Estimated Time For Driver To Arrive: " + msToTime(d.getTime() - (1000 * 60 * 60 * 8) +
    (closestDriver.closestDriverMinutes * 60 * 1000));
  document.getElementById('estimateDriverArrival').setAttribute("class", "");
  document.getElementById("estimate").innerHTML = "Estimated Arrival To Your Destination: " + msToTime(d.getTime() - (1000 * 60 * 60 * 8) +
    (durationInMinutes * 60 * 1000) + (closestDriver.closestDriverMinutes * 60 * 1000));
  document.getElementById('estimate').setAttribute("class", "");
  var tempurl = window.location.href;
  location.href = "#openModal";
  history.pushState('', 'Let It Fly', tempurl);
}

function closeModal() {
  var tempurl = window.location.href;
  location.href = "#close";
  history.pushState('', 'Let It Fly', tempurl);
}

function declineRide() {
  var tempurl = window.location.href;
  location.href = "#close";
  history.pushState('', 'Let It Fly', tempurl);
  markers = markers2.slice(0);
  getMapView(riderIdFromURL);
}

// dont touch this, its to guess the address you type in and check if at least origin/destination is an airport
AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
  var me = this;
  // var flag = true;
  autocomplete.bindTo('bounds', this.map);
  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();

    if (!place.place_id) {
      window.alert("Please select an option from the dropdown list.");
      return;
    }
    if (mode === 'ORIG') {
      me.originPlaceId = place.place_id;
      countyCheckHelper(me.originPlaceId);

    } else {
      me.destinationPlaceId = place.place_id;
      countyCheckHelper(me.destinationPlaceId);
    }
    var flag = checkValidAirport(me.originPlaceId, me.destinationPlaceId);
    if(flag == false) { me.originPlaceId = null ; me.destinationPlaceId = null }
  });

}

// this function is used to check whether the origin or destination is an airport, reloads if none are airports
function checkValidAirport(originPlaceId, destinationPlaceId) {
  if (!originPlaceId || !destinationPlaceId) {
    return;
  } else {
    var airportPlaceId = validAirportPlace();
    if (!airportPlaceId.includes(originPlaceId) && !airportPlaceId.includes(destinationPlaceId)) {
      alert("Either the origin or destination must be an airport (SFO, SJC, or OAK)");
      document.getElementById('origin-input').value = '';
      document.getElementById('destination-input').value = '';
      return false;
      //location.reload();
    } else {
      originPID = originPlaceId;
      destinationPID = destinationPlaceId;
      return true;
    }
  }
};

// this function will display the turn by turn diretions on the map and get rid of the origin/destination input boxes
// also rename the button from "submit" to "ride details", and change it's onclick to open modal to see current ride details
function displayStepByStep() {
  var tempurl = window.location.href;
  location.href = "#close";
  history.pushState('', 'Let It Fly', tempurl);
  directionsDisplay.setDirections(directionResponse);
  document.getElementById('origin-input').setAttribute("class", "hidden");
  document.getElementById('destination-input').setAttribute("class", "hidden");
  document.getElementById('rider-seat-input').setAttribute("class", "hidden");
  document.getElementById('submit-button').innerHTML = "Ride Details";
  document.getElementById('submit-button').setAttribute("onClick", "javascript: modalAfterConfirm();");

};

// this gets called after the rider clicks on "ride details" button, it removes the confirm/decline button and opens the modal
function modalAfterConfirm() {
  document.getElementById('confirm').setAttribute("class", "hidden");
  document.getElementById('decline').setAttribute("class", "hidden");
  document.getElementById('close').setAttribute("class", "close");
  var tempurl = window.location.href;
  location.href = "#openModal";
  history.pushState('', 'Let It Fly', tempurl);
}

// this function converts origin place id and destination place id into the distance and duration of the trip
// so it can be used to calculate the price. it also calls details which converts place ids into long lat
function calculateAndDisplayRoute() {
  var deferred = $.Deferred();

  directionsService.route({
    origin: {
      'placeId': originPID
    },
    destination: {
      'placeId': destinationPID
    },
    travelMode: 'DRIVING'
  }, function(response, status) {
    if (status === 'OK') {
      directionResponse = response;
      calculatePrice(response.routes[0].legs[0].distance.value, response.routes[0].legs[0].duration.value);
      // console.log("~~~~~~~~~Test Array~~~~~~~~~~~~~~");
      var detailsPromise = details(response.geocoded_waypoints[0].place_id, response.geocoded_waypoints[1].place_id);
      // console.log(detailsPromise);
      detailsPromise.then(function(result) {
        console.log('detailsPromise finish result...');
        console.log(result);
        deferred.resolve(result);
      });
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });

  return deferred.promise();
};

// this function is the one that shows the rider step by step directions from the driver's location, to them, to their destination
function calculateAndDisplayRoute2(driverLat, driverLng) {
  var waypts = [];
  waypts.push({
    location: {lat: riderOriginLat, lng: riderOriginLng},
    stopover: true
  });
  directionsService.route({
    origin: {lat: driverLat, lng: driverLng},
    waypoints: waypts,
    destination: {lat: riderDestLat, lng: riderDestLng},
    travelMode: 'DRIVING'
  }, function(response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

// parse results to find county, refreshes map if county is not san mateo, santa clara, or alameda
function findCounty(results) {
  var filtered_array = results[0].address_components.filter(function(address_component) {
    return address_component.types.includes("administrative_area_level_2");
  });
  var county = filtered_array.length ? filtered_array[0].long_name : "";
  if (!validCounty(county)) {
    alert("Out of County Boundaries, Please Enter a Different location");
    location.reload();
  }
  return county;
}

// helper function for county check
function validCounty(county) {
  return county == 'Alameda County' || county == 'San Mateo County' || county == 'Santa Clara County';
}

// countyCheckHelper
function countyCheckHelper(placeid) {
  var countyGeocoder = new google.maps.Geocoder();
  countyGeocoder.geocode({
    'placeId': placeid
  }, function(result, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        findCounty(result);
      } else {
        alert("Geocode was not successful for the following: " + status);
      }
  });
}



// function to calculate price using distance and duration and then modifys the modal box using the info
function calculatePrice(distanceInMeters, durationInSeconds) {
  var baseFare = 2.5;
  var pricePerMinute = 0.24;
  var pricePerMile = 1.95; //remember to give first 2 miles for free

  // duration is in seconds and distance is in meters, so we have to covert
  // into minutes and miles
  durationInMinutes = (durationInSeconds / 60).toFixed(0);
  var distanceInMiles = (distanceInMeters / 1609.34).toFixed(1);
  console.log(durationInMinutes);
  console.log(distanceInMiles);

  //total will show price of 15 dollar minimum
  totalPrice = Math.max(baseFare + (durationInMinutes * pricePerMinute) + ((distanceInMiles - 2) * pricePerMile), 15).toFixed(2);
  modifyModal(durationInMinutes, distanceInMiles, totalPrice);
}

// this function modifies the modal box to display the estimated price, distance, duration with confirm / decline button
function modifyModal(durationInMinutes, distanceInMiles, price) {
  document.getElementById('initial').setAttribute("class", "hidden");
  document.getElementById("distance").innerHTML = "Your Ride Distance : " + distanceInMiles + " miles";
  document.getElementById("duration").innerHTML = "Your Ride Duration : " + durationInMinutes + " minutes";
  document.getElementById("price").innerHTML = "Total Calculated Price : $" + price;
  document.getElementById('confirm').setAttribute("class", "btn-confirm");
  document.getElementById('decline').setAttribute("class", "btn-decline");
  document.getElementById('close').setAttribute("class", "hidden");
}

// this function converts miliseconds to human readable time
function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = parseInt((duration / 1000) % 60),
    minutes = parseInt((duration / (1000 * 60)) % 60),
    hours = parseInt((duration / (1000 * 60 * 60) % 24));

  var end = "AM";
  if (hours > 12) {
    end = "PM";
    hours %= 12;
  }

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + " " + end;
}

//array of place ids of airports, including some nearby stuff like cellphone lots, parking, baggage pickup locations
//see google drive for name of each id
function validAirportPlace() {
  var valid = ["ChIJm8Wz-sPLj4ARPn72bT9E-rw", "ChIJybx_mpXLj4ARTo8TPGOw-bY", "ChIJU7sQ6-rLj4ARFcjeauLjF3A",
    "ChIJJbnd98DLj4ARnLWlNvkZ1jI", "ChIJ5wkY0JXLj4AR4yF_zytyXvs", "ChIJoR7aAZfLj4AR-7b2EMStvE8",
    "ChIJh7we-cDLj4ARwFUYEHuH6rw", "ChIJ4Xj0hpbLj4AR_Qf9DzSCHVQ", "ChIJyRLmLcDLj4ARMKyoKkBXzV4",
    "ChIJVVVVVYx3j4ARP-3NGldc8qQ", "ChIJV2Q04pN3j4ARu9rOcaf5UjU", "ChIJUd3-8JB3j4ARZePhlvmYnvc",
    "ChIJnS-7y5J3j4AR6Qg6UFa9NGE", "ChIJbbaCeJF3j4ARo5zcvfJQ4es", "ChIJ55z15yp4j4ARoVWFukbgzwo",
    "ChIJbZs2Iy14j4ARbN3n5O9iFK8", "ChIJAwAv_cx5j4ARlXfukuZqOQE", "ChIJTZ0XOSt4j4ARnuPuVs1AH6Y",
    "ChIJVVVVVYx3j4ARyN7qnq2JceQ", "ChIJQabAAlSEj4ARYHQBAw8MY7A", "ChIJu0En3QSFj4ARx_cFCHMV6z0",
    "ChIJLd7if6GFj4ARiHWhAH2cTaU", "ChIJYb6-0gSFj4ARADjUgrDzB8k", "ChIJn4zqsQaFj4ARnTOR7vEnmcA",
    "ChIJCQq50rWFj4AR4bo5FthEzXU", "ChIJY0qG2giFj4ARtshexOmLHO4"
  ];
  return valid;
}

// this function stores and returns an array with the following items
// origin lat, origin lng, destination lat, destination lng, distance, duration
// it will also convert the origin/destination place into lat long values and stores
// them inside riderOriginLat, riderOriginLng, riderDestLat, riderOriginLng
function details(origin_PlaceId, destination_PlaceId) {
  console.log('details.....');
  var deferred = $.Deferred();
  var details3Promise = details3(origin_PlaceId, destinationPID);
  details3Promise.then(function(result) {
    deferred.resolve(result);
  });
  return deferred.promise();
}

//*******************
//split detail into 3 separate synchronous functions
var geocoder = new google.maps.Geocoder();

function details1(origin_PlaceId) {
  console.log('details1.....');
  var formData = {};
  var deferred = $.Deferred();

  geocoder.geocode({
    'placeId': origin_PlaceId
  }, function(results, status) {
    // and this is function which processes response
    if (status == google.maps.GeocoderStatus.OK) {
      formData["latOrigin"] = results[0].geometry.location.lat();
      formData["lngOrigin"] = results[0].geometry.location.lng();
      riderOriginLat = results[0].geometry.location.lat();
      riderOriginLng = results[0].geometry.location.lng();
      console.log('details1 results:..');
      console.log(formData);
      deferred.resolve(formData);

    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
  return deferred.promise();
}

function details2(origin_PlaceId, destination_PlaceId) {
  console.log('details2.....');
  var deferred = $.Deferred();
  var details1Promise = details1(origin_PlaceId);
  details1Promise.then(function(result) {

    // var deferred = $.Deferred();
    geocoder.geocode({
      'placeId': destination_PlaceId
    }, function(results, status) {
      // and this is function which processes response
      if (status == google.maps.GeocoderStatus.OK) {
        result["latDestination"] = results[0].geometry.location.lat();
        result["lngDestination"] = results[0].geometry.location.lng();
        riderDestLat = results[0].geometry.location.lat();
        riderDestLng = results[0].geometry.location.lng();
        deferred.resolve(result);
        console.log('details2 results:..');
        console.log(result);

      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  });
  return deferred.promise();
}

function details3(origin_PlaceId, destination_PlaceId) {
  console.log('details3.....');
  var deferred = $.Deferred();
  var details2Promise = details2(origin_PlaceId, destination_PlaceId);
  details2Promise.then(function(result) {
    var directionsRequest = {
      origin: {placeId: origin_PlaceId},
      destination: {placeId: destination_PlaceId},
      travelMode: "DRIVING"
    };

    directionsService.route(directionsRequest, function(response, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        result["distance"] = (response.routes["0"].legs["0"].distance.value / 1609.34).toFixed(1);
        result["duration"] = (response.routes["0"].legs["0"].duration.value / 60).toFixed(0);
        console.log('details3 results:..');
        console.log(result);
        deferred.resolve(result);
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }
    });
  });
  return deferred.promise();
}
//***************

// initializes the google maps so it is viewable
function initMap() {
  //creates a new map object with center at blair island
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 37.5209, lng: -122.2257},
    zoom: 10,
    minZoom: 10,
    MapOptions: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.BOTTOM_LEFT
    },
  });

  // show traffic
  // var trafficLayer = new google.maps.TrafficLayer();
  // trafficLayer.setMap(map);

  //lets origin and destination text box auto complete to a place/address
  new AutocompleteDirectionsHandler(map);
  showDriverMarker(map);

  //uses currentLocation.js to add gps button and marker to current locaion
  gps(map);

  var riderInfo = riderIdFromURL;
  console.log(riderInfo);
  //socketRider.js function
  getMapView(riderInfo);
}

// the confirm button click means the rider wants to accept the ride
//
var confirmButton = document.getElementById('confirm');
confirmButton.onclick = function() {
  document.getElementById('driverMinutesAway').setAttribute("class", "hidden");
  document.getElementById('estimateDriverArrival').setAttribute("class", "hidden");
  displayStepByStep();
  console.log("Confirm button clicked");

  // setTimeout(function() {
    if (!carpool) {
      var closestDriver = test(); //for carpool use test2()
      //check if driver is within 30 minutes if not, alert no drivers
      if (closestDriver.closestDriverMinutes > 30) {
        alert("No driver 30 minutes or less away from you");
        location.reload();
        return;
      }
      ////data for request ride: driver id, rider id, dest long, dest lat, start long, start lat, cost, carpool, time

      console.log("closest driver test");
      console.log(closestDriver);

      var driverData = {
        'driverID': closestDriver.closestDriverId,
        'riderLat': riderOriginLat,
        'riderLng': riderOriginLng,
        'destinationLat': riderDestLat,
        'destinationLng': riderDestLng,
        'riderID': riderIdFromURL,
        'cost': totalPrice,
        'carpool': false,
        'duration': durationInMinutes,
        'requestSeats': requestSeats
      };
      updateMarker(closestDriver.closestDriverId, closestDriver.availableSeats - requestSeats);
      calculateAndDisplayRoute2(closestDriver.closestDriverLat, closestDriver.closestDriverLng);
      console.log('closet driver data');
      console.log(driverData);
      notifyDriver(driverData);
    } else { //carpool
      console.log(theDriverId);
      var closestDriver = test2(theDriverId); //for carpool use test2()

      //check if driver is within 30 minutes if not, alert no drivers
      if (closestDriver.closestDriverMinutes > 30) {
        alert("No driver 30 minutes or less away from you");
        location.reload();
        return;
      }
      ////data for request ride: driver id, rider id, dest long, dest lat, start long, start lat, cost, carpool, time

      console.log("closest driver test carpool");
      console.log(closestDriver);

      var driverData = {
        'driverID': closestDriver.closestDriverId,
        'riderLat': riderOriginLat,
        'riderLng': riderOriginLng,
        'destinationLat': riderDestLat,
        'destinationLng': riderDestLng,
        'riderID': riderIdFromURL,
        'cost': totalPrice,
        'carpool': true,
        'duration': durationInMinutes,
        'requestSeats': requestSeats
      };
      updateMarker(closestDriver.closestDriverId, closestDriver.availableSeats - requestSeats);
      calculateAndDisplayRoute2(closestDriver.closestDriverLat, closestDriver.closestDriverLng);
      console.log('closet driver data');
      console.log(driverData);
      notifyOthersOfCarpool(driverData);
      // notifyDriver(driverData);
    }
  // }, 2000); //not sure if necessary but just in case
}

// this function will find the closest driver, set the driverData, update the modal
// that updates the box that the rider sees after their click on submit
function getRiderInfo(data) {
  console.log('find closest driiver marker...');
  console.log(data);
  var findClosestDriverMarkerPromise = findClosestDriverMarker(data);
  findClosestDriverMarkerPromise.then(function(result) {
    var closestDriver = test();
    console.log(closestDriver);
    console.log("GET RIDER INFO: " + closestDriver);
    //check if driver is within 30 minutes if not, alert no drivers
    if (closestDriver.closestDriverMinutes > 30) {
      alert("No driver 30 minutes or less away from you with enough seats");
      location.reload();
      return;
    }
    ////data for request ride: driver id, rider id, dest long, dest lat, start long, start lat, cost, carpool, time

    console.log("closest driver test");
    console.log(closestDriver);

    var driverData = {
      'driverID': closestDriver.closestDriverId,
      'riderLat': riderOriginLat,
      'riderLng': riderOriginLng,
      'destinationLat': riderDestLat,
      'destinationLng': riderDestLng,
      'riderID': riderIdFromURL,
      'cost': totalPrice,
      'carpool': false,
      'duration': durationInMinutes,
      'closestDriverMinutes': closestDriver.closestDriverMinutes,
      'seats': closestDriver.availableSeats
    };

    if (driverData.seats < requestSeats) {
      //this will never get called
      alert('Closest driver does not have enough seats');
      location.reload();
      return;
    } else {
      console.log('found closet driver data');
      console.log(driverData);
      displayModal(driverData);
      return driverData;
    }
  });
}

// this function will find the closest driver, set the driverData, update the modal
// that updates the box that the rider sees after their click on submit
function getRiderInfoCarpool(data) {
  console.log("inside getRiderInfoCarpool");
  console.log(data);
  this.theDriverId = data[0].driverid;
  console.log(theDriverId);

  var carpoolHelperPromise = carpoolHelper(data);
  carpoolHelperPromise.then(function(result) {
    var closestDriver = test2(theDriverId);
    removeMarkersExcept(theDriverId);
    console.log(closestDriver);
    console.log("GET CARPOOL RIDER INFO: " + closestDriver);
    //check if driver is within 30 minutes if not, alert no drivers
    if (closestDriver.closestDriverMinutes > 30) {
      alert("Carpool fail, driver is too far away");
      location.reload();
      return;
    }
    ////data for request ride: driver id, rider id, dest long, dest lat, start long, start lat, cost, carpool, time

    console.log("closest driver test");
    console.log(closestDriver);

    var driverData = {
      'driverID': theDriverId,
      'riderLat': riderOriginLat,
      'riderLng': riderOriginLng,
      'destinationLat': riderDestLat,
      'destinationLng': riderDestLng,
      'riderID': riderIdFromURL,
      'cost': totalPrice,
      'carpool': false,
      'duration': durationInMinutes,
      'closestDriverMinutes': closestDriver.closestDriverMinutes,
      'seats': closestDriver.availableSeats
    };
    if (driverData.seats < requestSeats) {
      alert('Closest driver does not have enough seats');
      location.reload();
      return;
    } else {
      console.log('closet driver data');
      console.log(driverData);
      displayModal(driverData);
      secondRiderDiscount();
      return driverData;
    }
  });
}

var carpool = false;

// the logic stuff to check if carpool is valid, 2 mile thingy
function checkCarpoolFunction(originalRiderOriginLat, originalRiderOriginLng, bothDestinationLat, bothDestinationLng) {
  var deferred = $.Deferred();
  console.log("data coming into checkCarpoolFunction");
  console.log(originalRiderOriginLat);
  console.log(originalRiderOriginLng);
  console.log(bothDestinationLat);
  console.log(bothDestinationLng);
  console.log(riderOriginLat);
  console.log(riderOriginLng);
  var formData = {};
  // var directionsService = new google.maps.DirectionsService();

  var waypts = [];
  waypts.push({
    location: {lat: riderOriginLat, lng: riderOriginLng},
    stopover: true
  });

  var directionsRequest = {
    origin: {lat: originalRiderOriginLat, lng: originalRiderOriginLng},
    waypoints: waypts,
    destination: {lat: bothDestinationLat,lng: bothDestinationLng},
    travelMode: "DRIVING"
  }

  directionsService.route(directionsRequest, function(response, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      formData.carpool = ((response.routes["0"].legs["0"].distance.value + response.routes["0"].legs["1"].distance.value) / 1609.34).toFixed(1);
      var temp = ((response.routes["0"].legs["0"].distance.value + response.routes["0"].legs["1"].distance.value) / 1609.34).toFixed(1);
      directionsRequest = {
        origin: {lat: originalRiderOriginLat, lng: originalRiderOriginLng},
        destination: {lat: bothDestinationLat, lng: bothDestinationLng},
        travelMode: "DRIVING"
      }

      directionsService.route(directionsRequest, function(response, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          formData.direct = (response.routes["0"].legs["0"].distance.value / 1609.34).toFixed(1);
          var temp2 = (response.routes["0"].legs["0"].distance.value / 1609.34).toFixed(1);
          if (Math.abs(temp2 - temp) > 2) {
            console.log("cannot carpool");
            carpool = false;
            deferred.resolve(false);
          } else {
            console.log("can carpool");
            carpool = true;
            deferred.resolve(true);
          }
        } else {
          alert("Geocode was not successful for the following reason2: " + status);
        }
      });
    } else {
      alert("Geocode was not successful for the following reason1: " + status);
    }
  });
  return deferred.promise();
}

function returnCarpoolBoolean() {
  return carpool;
}

// modal i update for price
function firstRiderDiscount() {
  totalPrice = totalPrice - 5;
  document.getElementById("price").innerHTML = "Total Calculated Price : $" + totalPrice;
}

// modal ui update for price
function secondRiderDiscount() {
  totalPrice = totalPrice - 5;
  document.getElementById("price").innerHTML = "Total Calculated Price : $" + totalPrice;
}


google.maps.event.addDomListener(window, 'load', initMap);
