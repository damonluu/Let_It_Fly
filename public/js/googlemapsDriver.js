var directionsService = new google.maps.DirectionsService();
var directionsDisplay = new google.maps.DirectionsRenderer();
var driverOriginLat;
var driverOriginLng;
var riderOriginLat;
var riderOriginLng;

function AutocompleteDirectionsHandler(map) {
  this.map = map;
  this.originPlaceId = null;
  var originInput = document.getElementById('origin-input');
  var submitButton = document.getElementById('submit-button');
  var pickedUpButton = document.getElementById('pickedUpRider-button');
  var completeRideButton = document.getElementById('completeRide-button');
  directionsDisplay.setMap(map);
  directionsDisplay.setPanel(document.getElementById('directionsPanel'));

  var originAutocomplete = new google.maps.places.Autocomplete(
    originInput, {
      placeIdOnly: true
    });

  this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
  this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(pickedUpButton);
  this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(completeRideButton);
  this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(originInput);
  this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(submitButton);

}

function pickedUpButtonClicked() {
  // document.getElementById('pickedUpRider-button').setAttribute("class", "hidden");
  document.getElementById('pickedUpRider-button').innerHTML = "Rider Information";
  document.getElementById('pickedUpRider-button').setAttribute("onClick", "javascript: modifyModal();");
  document.getElementById('completeRide-button').setAttribute("class", "");
}

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

function activeDriver() {
  alert("You are now Active. An Alert will appear when you are matched");
  var driverIdFromURL = parent.document.URL.substring(parent.document.URL.lastIndexOf(':') + 1);
  var driverInfo = {
    id: driverIdFromURL,
    lat: driverOriginLat,
    long: driverOriginLng,
    available: true
  };
  console.log(driverInfo);
  console.log(driverOriginLat);
  console.log(driverOriginLng);
  document.getElementById('origin-input').setAttribute("class", "hidden");
  document.getElementById('submit-button').setAttribute("class", "hidden");
  document.getElementById('pickedUpRider-button').setAttribute("class", "");



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

  //show traffic
  var trafficLayer = new google.maps.TrafficLayer();
  trafficLayer.setMap(map);

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
    location: {
      lat: riderLat,
      lng: riderLng
    },
    stopover: true
  });
  directionsService.route({
    origin: {
      lat: driverOriginLat,
      lng: driverOriginLng
    },
    waypoints: waypts,
    destination: {
      lat: destinationLat,
      lng: destinationLng
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

function getAddressFromCoord(lat, lng) {
  $.ajax({
    url: 'https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=AIzaSyDNIMuefOw8IFBBjGifWHAMMuSKOC7epj0',
    method: 'POST',
    success: function(result, status) {
      var address = result.results[0].formatted_address;
      // console.log(status + " : " + result.results[0].formatted_address);
      alert("The Rider is at " + address + "\nHere are the directions to reach them.")
    }
  });
}

// when using this, might have to set interval 2000 ms for the function that wants to use this result
function checkCarpoolfunction(originalRiderOriginLat, originalRiderOriginLng, carpoolOriginLat, carpoolOriginLng, bothDestinationLat, bothDestinationLng) {
  var dfd = new $.Deferred();
  var formData = {};
  var directionsService = new google.maps.DirectionsService();

  var waypts = [];
  waypts.push({
    location: {
      lat: carpoolOriginLat,
      lng: carpoolOriginLng
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
      directionsService.route(directionsRequest, function(response, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          formData.direct = (response.routes["0"].legs["0"].distance.value / 1609.34).toFixed(1);
          var temp2 = (response.routes["0"].legs["0"].distance.value / 1609.34).toFixed(1);
          // console.log(temp);
          // console.log(temp2);
          // console.log(temp2 - temp);
          // console.log(Math.abs(temp2 - temp));
          if (Math.abs(temp2 - temp) > 2) {
            dfd.resolve(false);
          } else {
            dfd.resolve(true);
          }

        } else {
          alert("Geocode was not successful for the following reason: " + status);
        }
      });
    } else {
      alert("Geocode was not successful for the following reason: " + status);
    }
  });
  // },2000);
  return dfd.promise();
}


function checkCarpoolResult(originalRiderOriginLat, originalRiderOriginLng, carpoolOriginLat, carpoolOriginLng, bothDestinationLat, bothDestinationLng) {
  checkCarpoolfunction(originalRiderOriginLat, originalRiderOriginLng, carpoolOriginLat, carpoolOriginLng, bothDestinationLat, bothDestinationLng).done(function(result) {
    console.log(result);
    if (result) {
      console.log("can carpool");
    } else {
      console.log("cannot carpool");
    }
  });

}


google.maps.event.addDomListener(window, 'load', initMap);

// setTimeout(function() {
//   calculateAndDisplayRoute(37.3496, -121.9390, 37.7749, -122.4194);
// }, 5000);

// setTimeout(function() {
//   console.log(checkCarpoolfunction(37.3352, -121.8811, 37.4323, -121.8996, 37.7749, -122.4194));
// }, 2000);

//https://maps.googleapis.com/maps/api/geocode/json?latlng=' + lat + ',' + lng + '&key=AIzaSyDNIMuefOw8IFBBjGifWHAMMuSKOC7epj0',
//https://maps.googleapis.com/maps/api/distancematrix/json?origins=latlng='37.3352, -121.8811'&destinations=390+W+el+camino+real,+Sunnyvale,+CA&departure_time=1541202457&traffic_model=best_guess&key=AIzaSyDNIMuefOw8IFBBjGifWHAMMuSKOC7epj0


checkCarpoolResult(37.3352, -121.8811, 37.4611, -122.1394, 37.7749, -122.4194);
checkCarpoolResult(37.3352, -121.8811, 37.4323, -121.8996, 37.7749, -122.4194);
