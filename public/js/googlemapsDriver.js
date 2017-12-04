var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer();
var driverOriginLat;
var driverOriginLng;
var riderOriginLat;
var riderOriginLng;
var driverOrigin;

function AutocompleteDirectionsHandler(map) {
  this.map = map;
  this.originPlaceId = null;
  var originInput = document.getElementById('origin-input');
  var submitButton = document.getElementById('submit-button');
  var seatInput = document.getElementById('driver-seat-input');
  var pickedUpButton = document.getElementById('pickedUpRider-button');
  var completeRideButton = document.getElementById('completeRide-button');
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directionsPanel'));

  var originAutocomplete = new google.maps.places.Autocomplete(
    originInput, {
      placeIdOnly: true
    });

  this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
  this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(pickedUpButton);
  this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(completeRideButton);
  this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(originInput);
  this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(seatInput);
  this.map.controls[google.maps.ControlPosition.TOP_CENTER].push(submitButton);

}

// THIS CHANGES THE BUTTONS AFTER CLICKING PICKED UP
function pickedUpButtonClicked() {
  // document.getElementById('pickedUpRider-button').setAttribute("class", "hidden");
  document.getElementById('pickedUpRider-button').innerHTML = "Rider Information";
  document.getElementById('pickedUpRider-button').setAttribute("onClick", "javascript: modifyModal();");
  document.getElementById('completeRide-button').setAttribute("class", "");
}

// THIS IS SUPPOSED TO DELETE RIDE FROM RIDES AND TRIGGER WILL MOVE IT TO PAST RIDES
function completeRideButtonClicked() {
  var driverIdFromURL = parent.document.URL.substring(parent.document.URL.lastIndexOf(':') + 1);
  var driverInfo = {
    id: driverIdFromURL
  };
  removeDriver(driverInfo);
}


// THIS IS SUPPOSED TO UPDATE THE RIDER STUFF IN  "view rider info"
function modifyModal() {
  // call function to retrieve rider information
  //   // var d = new Date();
  //   // document.getElementById("estimate").innerHTML = "Estimated Arrival : " + msToTime(d.getTime() - (1000 * 60 * 60 * 8) + (durationInMinutes * 60 * 1000));
  //   document.getElementById('initial').setAttribute("class", "hidden");
  //   document.getElementById("distance").innerHTML = "Total Distance : " + distanceInMiles + " miles";
  //   document.getElementById("duration").innerHTML = "Total Duration : " + durationInMinutes + " minutes";
  //   document.getElementById("price").innerHTML = "Total Calculated Price : $" + price;
  //   document.getElementById('confirm').setAttribute("class", "btn-confirm");
  //   document.getElementById('decline').setAttribute("class", "btn-decline");
  //   document.getElementById('close').setAttribute("class", "hidden");
  location.href = "#openModal";
}

// THIS FUNCTION TAKES THE DRIVER ENTERED LOCATION AND INSERTS THEM INTO DB
function activeDriver() {
  var availableSeats = document.getElementById("driver-seat-input").value;
  var getGeocodePromise = getGeocode(driverOrigin);
  getGeocodePromise.then(function(result) {
    var checkInput = document.getElementById("origin-input").value;
    if (checkInput == "" || checkInput.length == 0 || checkInput == null) {
      alert("Please enter your location first");
    } else if (availableSeats == "" || availableSeats.length == 0 ) {
      alert("Please enter the number of your party")
    } else if (!availableSeats.match(/\d+/)) {
      alert("Please enter digits for the number of available seats");
    } else if (availableSeats <= 0){
      alert("You fool, you have no seats for the rider\nNo, sitting in the trunk is not an option");
    } else {
      alert("You are now Active. An Alert will appear when you are matched");
      var driverIdFromURL = parent.document.URL.substring(parent.document.URL.lastIndexOf(':') + 1);
      var driverInfo = {
        id: driverIdFromURL,
        lat: driverOriginLat,
        long: driverOriginLng,
        available: true,
        seats: availableSeats
      };
      console.log(driverInfo);
      console.log(driverOriginLat);
      console.log(driverOriginLng);
      console.log(availableSeats);
      document.getElementById('origin-input').setAttribute("class", "hidden");
      document.getElementById('submit-button').setAttribute("class", "hidden");
      document.getElementById('driver-seat-input').setAttribute("class", "hidden");
      addDriver(driverInfo);
    }
  });
}

function directionToRider(data) {
  calculateAndDisplayRoute(data.riderLat, data.riderLng, data.destinationLat, data.destinationLng);
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
      driverOrigin = me.originPlaceId;
      countyCheckHelper(me.originPlaceId);
    }
  });
}

function getGeocode(placeid) {
  var deferred = $.Deferred();
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
      driverOriginLat = results[0].geometry.location.lat();
      driverOriginLng = results[0].geometry.location.lng();
      deferred.resolve(true);

    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
  return deferred.promise();
}

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

  //show traffic
  // var trafficLayer = new google.maps.TrafficLayer();
  // trafficLayer.setMap(map);

  //lets origin and destination text box auto complete to a place/address
  new AutocompleteDirectionsHandler(map);
  showDriverMarker(map);

  //uses currentLocation.js to add gps button and marker to current locaion
  gps(map);
}

function calculateAndDisplayRoute(riderLat, riderLng, destinationLat, destinationLng) {
  getAddressFromCoord(riderLat, riderLng)
  var waypts = [];
  waypts.push({
    location: {lat: riderLat, lng: riderLng},
    stopover: true
  });
  directionsService.route({
    origin: {lat: driverOriginLat, lng: driverOriginLng},
    waypoints: waypts,
    destination: {lat: destinationLat, lng: destinationLng},
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

function getAddressFromCoord(lat, lng) {
  $.ajax({
    url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=AIzaSyCbwzfaOyI1NHYXHxO184YFUc0LhQQz7RE',
    method: 'POST',
    success: function(result, status) {
      var address = result.results[0].formatted_address;
      // console.log(status + " : " + result.results[0].formatted_address);
      alert("The Rider is at " + address + "\nHere are the directions to reach them.")
    }
  });
  document.getElementById('pickedUpRider-button').setAttribute("class", "");
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

google.maps.event.addDomListener(window, 'load', initMap);
