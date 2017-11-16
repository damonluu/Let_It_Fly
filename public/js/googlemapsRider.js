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

function AutocompleteDirectionsHandler(map) {
  this.map = map;
  this.originPlaceId = null;
  this.destinationPlaceId = null;
  this.travelMode = 'DRIVING';
  var originInput = document.getElementById('origin-input');
  var destinationInput = document.getElementById('destination-input');
  var submitButton = document.getElementById('submit-button');
  // this.directionsService = new google.maps.DirectionsService;
  // var directionsDisplay = new google.maps.DirectionsRenderer;
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directionsPanel'));
  // directionsDisplay = new google.maps.DirectionsRenderer({
  //   draggable: true,
  //   map: map,
  //   panel: document.getElementById('right-panel')
  // });

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
    if (checkInput1 == "" || checkInput1.length == 0 || checkInput1 == null || checkInput2 == "" || checkInput2.length == 0 || checkInput2 == null) {
      alert("Please enter your location first");
    } else {
      calculateAndDisplayRoute();


      // var closestDriver = test();
      // setTimeout(function() {
      //   calculateAndDisplayRoute();
      //   document.getElementById("driverMinutesAway").setAttribute("class", "");
      //   document.getElementById("driverMinutesAway").innerHTML = "Closest Driver is " + closestDriver.closestDriverMinutes + " minutes away";
      //   var d = new Date();
      //   document.getElementById("estimateDriverArrival").innerHTML = "Estimated Time For Driver To Arrive: " + msToTime(d.getTime() - (1000 * 60 * 60 * 8) +
      //     (closestDriver.closestDriverMinutes * 60 * 1000));
      //   document.getElementById('estimateDriverArrival').setAttribute("class", "");
      //   document.getElementById("estimate").innerHTML = "Estimated Arrival To Your Destination: " + msToTime(d.getTime() - (1000 * 60 * 60 * 8) +
      //     (durationInMinutes * 60 * 1000) + (closestDriver.closestDriverMinutes * 60 * 1000));
      //   document.getElementById('estimate').setAttribute("class", "");
      //   location.href = "#openModal";
      // }, 3000);

      var riderInfo = {
      'riderID': riderIdFromURL,
      'riderLat': riderOriginLat,
      'riderLng': riderOriginLng,
      'destinationLat': riderDestLat,
      'destinationLng': riderDestLng
    };

    setTimeout(function() {
    searchDriver(riderInfo);
    }, 3000);

    }
  };

  this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
  this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

  this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(originInput);
  this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(destinationInput);
  this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(submitButton);
}

function displayModal(closestDriver){
  //  setTimeout(function() {
        // calculateAndDisplayRoute();
        document.getElementById("driverMinutesAway").setAttribute("class", "");
        document.getElementById("driverMinutesAway").innerHTML = "Closest Driver is " + closestDriver.closestDriverMinutes + " minutes away";
        var d = new Date();
        document.getElementById("estimateDriverArrival").innerHTML = "Estimated Time For Driver To Arrive: " + msToTime(d.getTime() - (1000 * 60 * 60 * 8) +
          (closestDriver.closestDriverMinutes * 60 * 1000));
        document.getElementById('estimateDriverArrival').setAttribute("class", "");
        document.getElementById("estimate").innerHTML = "Estimated Arrival To Your Destination: " + msToTime(d.getTime() - (1000 * 60 * 60 * 8) +
          (durationInMinutes * 60 * 1000) + (closestDriver.closestDriverMinutes * 60 * 1000));
        document.getElementById('estimate').setAttribute("class", "");
        location.href = "#openModal";
  //  }, 3000);
}



AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
  var me = this;
  autocomplete.bindTo('bounds', this.map);
  autocomplete.addListener('place_changed', function() {
    var place = autocomplete.getPlace();

    if (!place.place_id) {
      window.alert("Please select an option from the dropdown list.");
      return;
    }
    if (mode === 'ORIG') {
      me.originPlaceId = place.place_id;
      getGeocode(me.originPlaceId);

    } else {
      me.destinationPlaceId = place.place_id;
      getGeocode(me.destinationPlaceId);
    }
    checkValidAirport(me.originPlaceId, me.destinationPlaceId);
  });

}

function checkValidAirport(originPlaceId, destinationPlaceId) {
  if (!originPlaceId || !destinationPlaceId) {
    return;
  } else {
    var airportPlaceId = validAirportPlace();
    if (!airportPlaceId.includes(originPlaceId) && !airportPlaceId.includes(destinationPlaceId)) {
      alert("Either the origin or destination must be an airport (SFO, SJC, or OAK)");
      location.reload();
    } else {
      originPID = originPlaceId;
      destinationPID = destinationPlaceId;
    }
  }
};

function displayStepByStep() {
  directionsDisplay.setDirections(directionResponse);
  document.getElementById('origin-input').setAttribute("class", "hidden");
  document.getElementById('destination-input').setAttribute("class", "hidden");
  document.getElementById('submit-button').innerHTML = "Ride Details";
  document.getElementById('submit-button').setAttribute("onClick", "javascript: modalAfterConfirm();");
};

function modalAfterConfirm() {
  document.getElementById('confirm').setAttribute("class", "hidden");
  document.getElementById('decline').setAttribute("class", "hidden");
  document.getElementById('close').setAttribute("class", "close");
  location.href = "#openModal";
}

function calculateAndDisplayRoute() {
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
      console.log(details(response.geocoded_waypoints[0].place_id, response.geocoded_waypoints[1].place_id));
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

function calculateAndDisplayRoute2(driverLat, driverLng) {
  var waypts = [];
  waypts.push({
    location: {
      lat: riderOriginLat,
      lng: riderOriginLng
    },
    stopover: true
  });
  directionsService.route({
    origin: {
      lat: driverLat,
      lng: driverLng
    },
    waypoints: waypts,
    destination: {
      lat: riderDestLat,
      lng: riderDestLng
    },
    travelMode: 'DRIVING'
  }, function(response, status) {


    // console.log(response);
    if (status === 'OK') {
      // alert("Here are the directions to the Rider" );
      // alert(address);
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}

function getAddressFromLatLang(lat, lng, geocoder) {
  //console.log("Entering getAddressFromLatLang()");
  var latLng = new google.maps.LatLng(lat, lng);
  geocoder.geocode({
    'latLng': latLng
  }, function(results, status) {
    //console.log("After getting address");
    //console.log(results);
    if (status == google.maps.GeocoderStatus.OK) {
      if (results[0]) {
        console.log(results[0].formatted_address);
        console.log("County: " + findCounty(results));
        //alert(results[0].formatted_address);
      }
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }

  });
  //console.log("Exiting getAddressFromLatLang()");
}

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

function validCounty(county) {
  return county == 'Alameda County' || county == 'San Mateo County' || county == 'Santa Clara County';
}

function getGeocode(placeid) {
  //array to store the latitude and longitude
  var loc = [];
  // create a new Geocoder object
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    'placeId': placeid
  }, function(results, status) {
    // and this is function which processes response
    if (status == google.maps.GeocoderStatus.OK) {
      loc[0] = results[0].geometry.location.lat();
      loc[1] = results[0].geometry.location.lng();

      //alert(loc); // the place where loc contains geocoded coordinates
      getAddressFromLatLang(loc[0], loc[1], geocoder);

    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}
var totalPrice;

var totalPrice;

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

function modifyModal(durationInMinutes, distanceInMiles, price) {
  // var d = new Date();
  // document.getElementById("estimate").innerHTML = "Estimated Arrival : " + msToTime(d.getTime() - (1000 * 60 * 60 * 8) + (durationInMinutes * 60 * 1000));
  document.getElementById('initial').setAttribute("class", "hidden");
  document.getElementById("distance").innerHTML = "Your Ride Distance : " + distanceInMiles + " miles";
  document.getElementById("duration").innerHTML = "Your Ride Duration : " + durationInMinutes + " minutes";
  document.getElementById("price").innerHTML = "Total Calculated Price : $" + price;
  document.getElementById('confirm').setAttribute("class", "btn-confirm");
  document.getElementById('decline').setAttribute("class", "btn-decline");
  document.getElementById('close').setAttribute("class", "hidden");
}

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

function getRiderOriginLatLong() {
  return [riderOriginLat, riderOriginLng];
}

function details(origin_PlaceId, destination_PlaceId) {
  var formData = {};
  // var directionsService = new google.maps.DirectionsService();
  var directionsRequest = {
    origin: {
      placeId: origin_PlaceId
    },
    destination: {
      placeId: destination_PlaceId
    },
    travelMode: "DRIVING"
  }

  var geocoder = new google.maps.Geocoder();
  geocoder.geocode({
    'placeId': origin_PlaceId
  }, function(results, status) {
    // and this is function which processes response
    if (status == google.maps.GeocoderStatus.OK) {
      formData["latOrigin"] = results[0].geometry.location.lat();
      formData["lngOrigin"] = results[0].geometry.location.lng();
      riderOriginLat = results[0].geometry.location.lat();
      riderOriginLng = results[0].geometry.location.lng();
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
  geocoder.geocode({
    'placeId': destination_PlaceId
  }, function(results, status) {
    // and this is function which processes response
    if (status == google.maps.GeocoderStatus.OK) {
      formData["latDestination"] = results[0].geometry.location.lat();
      formData["lngDestination"] = results[0].geometry.location.lng();
      riderDestLat = results[0].geometry.location.lat();
      riderDestLng = results[0].geometry.location.lng();
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });


  directionsService.route(directionsRequest, function(response, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      // formData["originPlaceId"] = response.request.origin.placeId;
      // formData["destinationPlaceId"] = response.request.destination.placeId;
      formData["distance"] = (response.routes["0"].legs["0"].distance.value / 1609.34).toFixed(1);
      formData["duration"] = (response.routes["0"].legs["0"].duration.value / 60).toFixed(0);

    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
  return formData;
}


// This example requires the Places library. Include the libraries=places
// parameter when you first load the API. For example:
// <script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&libraries=places">

function initMap() {

  //creates a new map object with center at blair island
  var map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 37.5209,
      lng: -122.2257
    },
    zoom: 10,
    minZoom: 10,
    MapOptions: true,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
      position: google.maps.ControlPosition.BOTTOM_LEFT
    },
  });

  //show traffic
  var trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(map);

  //lets origin and destination text box auto complete to a place/address
  new AutocompleteDirectionsHandler(map);
  showDriverMarker(map);

  //uses currentLocation.js to add gps button and marker to current locaion
  gps(map);

  var riderIdFromURL = parent.document.URL.substring(parent.document.URL.lastIndexOf(':') + 1);
  var riderInfo = riderIdFromURL;
  //socketRider.js function
  getMapView(riderInfo);
}

var confirmButton = document.getElementById('confirm');
confirmButton.onclick = function() {
  document.getElementById('driverMinutesAway').setAttribute("class", "hidden");
  document.getElementById('estimateDriverArrival').setAttribute("class", "hidden");
  displayStepByStep();
  //findClosestDriverMarker();
  console.log("Confirm button clicked");
  setTimeout(function() {
    if(!carpool) {
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
      var riderIdFromURL = parent.document.URL.substring(parent.document.URL.lastIndexOf(':') + 1);

      var driverData = {
        'driverID': closestDriver.closestDriverId,
        'riderLat': riderOriginLat,
        'riderLng': riderOriginLng,
        'destinationLat': riderDestLat,
        'destinationLng': riderDestLng,
        'riderID': riderIdFromURL,
        'cost': totalPrice,
        'carpool': false,
        'duration': durationInMinutes
      };
      // var d = new Date();
      // document.getElementById("estimate").innerHTML = "Estimated Arrival To Destination: " + msToTime(d.getTime() - (1000 * 60 * 60 * 8)
      // + (durationInMinutes * 60 * 1000) + (closestDriver.closestDriverMinutes * 60 * 1000));
      // document.getElementById('estimate').setAttribute("class", "");
      calculateAndDisplayRoute2(closestDriver.closestDriverLat, closestDriver.closestDriverLng);
      console.log('closet driver data');
      console.log(driverData);
      notifyDriver(driverData);
    } else { //carpool
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
      var riderIdFromURL = parent.document.URL.substring(parent.document.URL.lastIndexOf(':') + 1);

      var driverData = {
        'driverID': closestDriver.closestDriverId,
        'riderLat': riderOriginLat,
        'riderLng': riderOriginLng,
        'destinationLat': riderDestLat,
        'destinationLng': riderDestLng,
        'riderID': riderIdFromURL,
        'cost': totalPrice,
        'carpool': false,
        'duration': durationInMinutes
      };
      // var d = new Date();
      // document.getElementById("estimate").innerHTML = "Estimated Arrival To Destination: " + msToTime(d.getTime() - (1000 * 60 * 60 * 8)
      // + (durationInMinutes * 60 * 1000) + (closestDriver.closestDriverMinutes * 60 * 1000));
      // document.getElementById('estimate').setAttribute("class", "");
      calculateAndDisplayRoute2(closestDriver.closestDriverLat, closestDriver.closestDriverLng);
      console.log('closet driver data');
      console.log(driverData);
      notifyDriver(driverData);
    }
  }, 500); //not necessary but just in case
}

function getRiderInfo() {
  setTimeout(function() {
        findClosestDriverMarker();
      }, 2000);
  setTimeout(function() {
      var closestDriver = test();
      console.log(closestDriver);
      console.log("GET RIDER INFO: " + closestDriver);
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
        'closestDriverMinutes':closestDriver.closestDriverMinutes
      };
      // var d = new Date();
      // document.getElementById("estimate").innerHTML = "Estimated Arrival To Destination: " + msToTime(d.getTime() - (1000 * 60 * 60 * 8)
      // + (durationInMinutes * 60 * 1000) + (closestDriver.closestDriverMinutes * 60 * 1000));
      // document.getElementById('estimate').setAttribute("class", "");
      // calculateAndDisplayRoute2(closestDriver.closestDriverLat, closestDriver.closestDriverLng);
      console.log('closet driver data');
      console.log(driverData);
      displayModal(driverData);
      return driverData;
  }, 3000);
}

var theDriverId;

function getRiderInfoCarpool(theDriverId) {
  console.log("inside getRiderInfoCarpool");
  // console.log(driverLat);
  // console.log(driverLng);
  this.theDriverId = theDriverId
  console.log(theDriverId);
  setTimeout(function() {
    carpoolHelper(theDriverId);
  }, 2000);
  setTimeout(function() {
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
    var riderIdFromURL = parent.document.URL.substring(parent.document.URL.lastIndexOf(':') + 1);

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
      'closestDriverMinutes': closestDriver.closestDriverMinutes
    };
    // var d = new Date();
    // document.getElementById("estimate").innerHTML = "Estimated Arrival To Destination: " + msToTime(d.getTime() - (1000 * 60 * 60 * 8)
    // + (durationInMinutes * 60 * 1000) + (closestDriver.closestDriverMinutes * 60 * 1000));
    // document.getElementById('estimate').setAttribute("class", "");
    // calculateAndDisplayRoute2(closestDriver.closestDriverLat, closestDriver.closestDriverLng);
    console.log('closet driver data');
    console.log(driverData);
    displayModal(driverData);
    return driverData;
  }, 3000);
}

var carpool = false;

// when using this, might have to set interval 2000 ms for the function that wants to use this result
function checkCarpoolFunction(originalRiderOriginLat, originalRiderOriginLng, bothDestinationLat, bothDestinationLng) {
  // var dfd = new $.Deferred();
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
    location: {
      lat: riderOriginLat,
      lng: riderOriginLng
    },
    stopover: true
  });

  var directionsRequest = {
    origin: {
      lat: originalRiderOriginLat,
      lng: originalRiderOriginLng
    },
    waypoints: waypts,
    destination: {
      lat: bothDestinationLat,
      lng: bothDestinationLng
    },
    travelMode: "DRIVING"
  }
  // setTimeout(function () {
  directionsService.route(directionsRequest, function(response, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      // console.log("level2");
      formData.carpool = ((response.routes["0"].legs["0"].distance.value + response.routes["0"].legs["1"].distance.value) / 1609.34).toFixed(1);
      var temp = ((response.routes["0"].legs["0"].distance.value + response.routes["0"].legs["1"].distance.value) / 1609.34).toFixed(1);
      directionsRequest = {
        origin: {
          lat: originalRiderOriginLat,
          lng: originalRiderOriginLng
        },
        destination: {
          lat: bothDestinationLat,
          lng: bothDestinationLng
        },
        travelMode: "DRIVING"
      }
      // console.log("level2end");
      directionsService.route(directionsRequest, function(response, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          formData.direct = (response.routes["0"].legs["0"].distance.value / 1609.34).toFixed(1);
          var temp2 = (response.routes["0"].legs["0"].distance.value / 1609.34).toFixed(1);
          // console.log(temp);
          // console.log(temp2);
          // console.log(temp2 - temp);
          // console.log(Math.abs(temp2 - temp));
          // console.log("level3");
          if (Math.abs(temp2 - temp) > 2) {
            // dfd.resolve(false);
            console.log("cannot carpool");
            carpool = false;
          } else {
            // dfd.resolve(true);
            console.log("can carpool");
            carpool = true;
          }

        } else {
          alert("Geocode was not successful for the following reason2: " + status);
        }
      });
    } else {
      alert("Geocode was not successful for the following reason1: " + status);
    }
  });
  // },2000);
  // return dfd.promise();
}

function returnCarpoolBoolean() {
  return carpool;
}


// function checkCarpoolResult(originalRiderOriginLat, originalRiderOriginLng, bothDestinationLat, bothDestinationLng) {
//   console.log("data coming into checkCarpoolResult");
//   console.log(originalRiderOriginLat);
//   console.log(originalRiderOriginLng);
//   console.log(bothDestinationLat);
//   console.log(bothDestinationLng);
//   checkCarpoolfunction(originalRiderOriginLat, originalRiderOriginLng, bothDestinationLat, bothDestinationLng).done(function(result) {
//     console.log(result);
//     if (result) {
//       console.log("can carpool");
//     } else {
//       console.log("cannot carpool");
//     }
//     return result;
//   });
//
// }



google.maps.event.addDomListener(window, 'load', initMap);
