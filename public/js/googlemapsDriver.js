var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer();
var driverOriginLat;
var driverOriginLng;

function AutocompleteDirectionsHandler(map) {
  this.map = map;
  this.originPlaceId = null;
  var originInput = document.getElementById('origin-input');
  var submitButton = document.getElementById('submit-button');
  var findRiderButton = document.getElementById('directionToRider-button');
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directionsPanel'));

  var originAutocomplete = new google.maps.places.Autocomplete(
    originInput, {
      placeIdOnly: true
    });

  this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
  this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(findRiderButton);

  this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(originInput);
  this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(submitButton);

}

function activeDriver() {
  alert("You are now Active. An Alert will appear when you are matched");
  var driverInfo = {
    id: 1000,
    lat: driverOriginLat,
    long: driverOriginLng,
    available: true
  };
  console.log(driverInfo);
  console.log(driverOriginLat);
  console.log(driverOriginLng);
  document.getElementById('origin-input').setAttribute("class", "hidden");
  document.getElementById('submit-button').setAttribute("class", "hidden");
  document.getElementById('directionToRider-button').setAttribute("class", "");


  // document.getElementById('submit-button').innerHTML = "Get Direction To Rider";
  // document.getElementById('submit-button').setAttribute("onClick", "javascript: directionToRider();" );
  // $.ajax({
  //       url: '/activateDriver',
  //       type: 'POST',
  //       contentType: "application/json; charset=UTF-8",
  //       data: JSON.stringify(driverInfo),
  //       success: function(result,status) {
  //         console.log('CREATED SUCCESSFULLY');
  //         //call insertDriverMarker from markets.js
  //         insertNewDriverMarker(1000,driverOriginLat,driverOriginLng);
  //         // insertNewDriverMarker('Palo Alto', 37.4419, -122.1430);
  //         // insertPaloAlto();
  //
  //       }
  // });
  addDriver(driverInfo);
}


//hard code pickup at scu and desination at sfo for now
function directionToRider() {
  calculateAndDisplayRoute(37.3496, -121.9390, 37.7749, -122.4194);
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
      // console.log(me.originPlaceId);
    }
  });
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
      driverOriginLat = results[0].geometry.location.lat();
      driverOriginLng = results[0].geometry.location.lng();

    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
}

var riderOriginLat;
var riderOriginLng;

function getRiderOriginLatLong() {
  return [riderOriginLat, riderOriginLng];
}

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

  //lets origin and destination text box auto complete to a place/address
  new AutocompleteDirectionsHandler(map);
  // showDriverMarker(map);

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
        url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng='+ lat + ',' + lng + '&key=AIzaSyDNIMuefOw8IFBBjGifWHAMMuSKOC7epj0',
        method: 'POST',
        success: function(result,status) {
          var address = result.results[0].formatted_address;;
          // console.log(status + " : " + result.results[0].formatted_address);
          alert("The Rider is at " + address + "\nHere are the directions to reach them.")
        }
    });
}



google.maps.event.addDomListener(window, 'load', initMap);

// setTimeout(function() {
//   calculateAndDisplayRoute(37.3496, -121.9390, 37.7749, -122.4194);
// }, 5000);
