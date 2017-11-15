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

function AutocompleteDirectionsHandler(map) {
  this.map = map;
  this.originPlaceId = null;
  this.destinationPlaceId = null;
  this.travelMode = 'DRIVING';
  var originInput = document.getElementById('origin-input');
  var destinationInput = document.getElementById('destination-input');
  var submitButton = document.getElementById('submit-button');
  // this.directionsService = new google.maps.DirectionsService;
  // this.directionsDisplay = new google.maps.DirectionsRenderer;
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
    calculateAndDisplayRoute();

    setTimeout(function() {
      findClosestDriverMarker();
    }, 2000);
    setTimeout(function() {
      var closestDriver = test();
      document.getElementById("driverMinutesAway").setAttribute("class", "");
      document.getElementById("driverMinutesAway").innerHTML = "Closest Driver is " + closestDriver.closestDriverMinutes + " minutes away";
      var d = new Date();
      document.getElementById("estimateDriverArrival").innerHTML = "Estimated Time For Driver To Arrive: " + msToTime(d.getTime() - (1000 * 60 * 60 * 8)
      + (closestDriver.closestDriverMinutes * 60 * 1000));
      document.getElementById('estimateDriverArrival').setAttribute("class", "");
      document.getElementById("estimate").innerHTML = "Estimated Arrival To Your Destination: " + msToTime(d.getTime() - (1000 * 60 * 60 * 8)
      + (durationInMinutes * 60 * 1000) + (closestDriver.closestDriverMinutes * 60 * 1000));
      document.getElementById('estimate').setAttribute("class", "");
      // document.getElementById("duration").innerHTML = "Total Ride Duration : " + durationInMinutes + " minutes";
      // document.getElementById("price").innerHTML = "Total Calculated Price : $" + price;
      // document.getElementById('confirm').setAttribute("class", "btn-confirm");
      // document.getElementById('decline').setAttribute("class", "btn-decline");
      // document.getElementById('close').setAttribute("class", "hidden");
      location.href = "#openModal";
    }, 3000);

    // stopAutoUpdate();
  };

  this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
  this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

  this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(originInput);
  this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(destinationInput);
  this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(submitButton);
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
  document.getElementById('submit-button').setAttribute("onClick", "javascript: modalAfterConfirm();" );
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
          location: {lat: riderOriginLat, lng: riderOriginLng},
          stopover: true
        });
  directionsService.route({
    origin: {lat: driverLat, lng: driverLng},
    waypoints: waypts,
    destination: {lat: riderDestLat, lng: riderDestLng},
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
  var total = Math.max(baseFare + (durationInMinutes * pricePerMinute) + ((distanceInMiles - 2) * pricePerMile), 15).toFixed(2);
  modifyModal(durationInMinutes, distanceInMiles, total);
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
  var directionsService = new google.maps.DirectionsService();
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
      position: google.maps.ControlPosition.TOP_LEFT
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

  //socketRider.js function
  getMapView();
}

var confirmButton = document.getElementById('confirm');
confirmButton.onclick = function() {
  document.getElementById('driverMinutesAway').setAttribute("class", "hidden");
  document.getElementById('estimateDriverArrival').setAttribute("class", "hidden");
  displayStepByStep();
  // findClosestDriverMarker();
  setTimeout(function() {
    var closestDriver = test();

    //check if driver is within 30 minutes if not, alert no drivers
    if(closestDriver.closestDriverMinutes > 30) {
      alert("No driver 30 minutes or less away from you");
      location.reload();
      return;
    }


    console.log("closest driver test");
    console.log(closestDriver);
    var driverData = {'driverID': closestDriver.closestDriverId, 'riderLat': riderOriginLat,
    'riderLng': riderOriginLng, 'destinationLat': riderDestLat,
    'destinationLng': riderDestLng};
    var d = new Date();
    // document.getElementById("estimate").innerHTML = "Estimated Arrival To Destination: " + msToTime(d.getTime() - (1000 * 60 * 60 * 8)
    // + (durationInMinutes * 60 * 1000) + (closestDriver.closestDriverMinutes * 60 * 1000));
    // document.getElementById('estimate').setAttribute("class", "");
    calculateAndDisplayRoute2(closestDriver.closestDriverLat, closestDriver.closestDriverLng);
    console.log('closet driver data');
    console.log(driverData);
    notifyDriver(driverData);
  }, 2000);

}

function trafficTest2(oLat, oLng, dLat, dLng) {
  var d = new Date();
  $.ajax({
    url: 'https://maps.googleapis.com/maps/api/distancematrix/json?origins=' + oLat + ',' + oLng + '&destinations=' + dLat + ',' + dLng
    + '&departure_time=' + d.getTime() + '&traffic_model=best_guess' +'&key=AIzaSyDNIMuefOw8IFBBjGifWHAMMuSKOC7epj0',
    method: 'POST',
    success: function(result, status) {
      // console.log(status);
      // console.log(result);
      // console.log(status + " : " + result.results[0].formatted_address);
      // alert("The Rider is at " + address + "\nHere are the directions to reach them.")
    }
  });
}

function trafficTest(originLat, originLng, destinationLat, destinationLng) {
  var dfd = $.Deferred();
  var service = new google.maps.DistanceMatrixService();
  service.getDistanceMatrix({
    origins: [{
      lat: originLat,
      lng: originLng
    }],
    destinations: [{
      lat: destinationLat,
      lng: destinationLng
    }],
    travelMode: 'DRIVING',
    traffic_model: 'best_guess',
    unitSystem: google.maps.UnitSystem.METRIC
  }, callback);

  function callback(response, status) {
    if (status == 'OK') {
      // distanceBetweenTwo = response.rows[0].elements[0].distance.value;
      // var duration = response.rows[0].elements[0].duration.value;
      // console.log(distanceBetweenTwo);
      console.log(response);
      dfd.resolve(response);
    } else {
      dfd.reject(status);
    }
  }
  // console.log(distanceBetweenTwo);
  // console.log(test);
  // return distanceBetweenTwo;
  return dfd.promise();
}

google.maps.event.addDomListener(window, 'load', initMap);

// getTravelTimeInTraffic(37.3352, -121.8811, 37.7749, -122.4194);
