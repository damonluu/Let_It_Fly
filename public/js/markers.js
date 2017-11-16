var markers = [];
var timeOut = 5000;
var mymap;
var driverArray = [];
var riderCurrentLat;
var riderCurrentLng;
var closestDistance = 999999;
var closestDriverID = 'IfYouSeeThisMarkerSomethingWentWrong';
var closestDriverMinutes = 9999;
var closestDriverLat;
var closestDriverLng;

var marker_image = new google.maps.MarkerImage(
  "img/map/vanMed.png"
);

function retrieveRiderOriginLatLong() {
  var latLng = getRiderOriginLatLong();
  riderCurrentLat = latLng[0];
  riderCurrentLng = latLng[1];
}

function showDriverMarker(map) {
  mymap = map;
  setMarkers(driverArray);
  // timeOut = setInterval(function() {
  //   reloadMarkers();
  //   // console.log("hello");
  //   // console.log(markers);
  //   console.log("markers");
  //   console.log(markers);
  //   console.log("driverArray");
  //   console.log(driverArray);
  // }, 5000);
}

function insertNewDriverMarker(driverId, lati, long) {
  // var myLatLng = new google.maps.LatLng(lat, lng);
  var marker = new google.maps.Marker({
    position: {lat: lati, lng: long},
    map: mymap,
    animation: google.maps.Animation.DROP,
    icon: marker_image,
    title: driverId.toString()
  });
  // markers[driverId] = marker;
  // driverArray[driverId] = [lat, lng];
  driverArray.push([driverId, lati, long]);
  markers.push(marker);
  console.log("Inserted " + driverId + " to markers");
  // console.log(markers);
}

function removeDriverMarker(driverId) {
  console.log("Removed " + driverId + " from markers");
  for (var i = 0; i < markers.length; i++) {
    if (markers[i].title == driverId) {
      // console.log("Driver to remove: " + driverId);
      markers[i].setMap(null);
      // delete markers[i];
      markers.splice(i, 1);
    }
  }

  for (var i = 0; i < driverArray.length; i++) {
    if (driverArray[i][0] == driverId) {
      // delete driverArray[i];
      driverArray.splice(i, 1);
    }
  }
  // markers[driverId].setMap(null);
  // delete markers[driverId];
  // delete driverArray[driverId];
}

// function stopAutoUpdate() {
//   clearTimeout(timeOut);
//   removeMarkersExcept(closestDriverID);
// }

function setMarkers(locations) {
  for (var i = 0; i < driverArray.length; i++) {
    var drivers = locations[i];
    console.log(drivers);
    console.log(drivers[1]);
    console.log(drivers[2]);
    // console.log(drivers);
    //var myLatLng = new google.maps.LatLng(drivers[1], drivers[2]);
    var marker = new google.maps.Marker({
      position: {lat: drivers[1], lng: drivers[2]},
      map: mymap,
      animation: google.maps.Animation.DROP,
      icon: marker_image,
      title: drivers[0].toString(),
    });

    // Push marker to markers array
    // markers[driver] = marker;
    markers.push(marker);
  }
}
//
function removeMarkers() {
  // Loop through markers and set map to null for each
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  // Reset the markers array
  markers = [];
}

function removeMarkersExcept(driverId) {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i].title != driverId) {
      markers[i].setMap(null);
    }
  }
  // Reset the markers array
  markers = [];
}

function reloadMarkers() {
  console.log('reloadMarkers() called');
  removeMarkers();
  // Call set markers to re-add markers
  setMarkers(driverArray);
}


function distanceBetweenTwoCoord(originLat, originLng, destinationLat, destinationLng) {
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
    unitSystem: google.maps.UnitSystem.METRIC
  }, callback);

  function callback(response, status) {
    if (status == 'OK') {
      // distanceBetweenTwo = response.rows[0].elements[0].distance.value;
      // var duration = response.rows[0].elements[0].duration.value;
      // console.log(distanceBetweenTwo);
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

function test() {
  console.log("The Closest Driver ID Is: " + closestDriverID);
  console.log("The Driver is " + (closestDistance / 1609.34).toFixed(1) + " Miles Away");
  console.log("The Driver is " + (closestDriverMinutes / 60).toFixed(0) + " Minutes Away");
  // stopAutoUpdate();
  removeMarkersExcept(closestDriverID);

  var resultData = [];
  resultData["closestDriverId"] = closestDriverID;
  resultData["closestDistance"] = (closestDistance / 1609.34).toFixed(1);
  resultData["closestDriverMinutes"] = (closestDriverMinutes / 60).toFixed(0);
  resultData["closestDriverLat"] = closestDriverLat;
  resultData["closestDriverLng"] = closestDriverLng;

  return resultData;
}

function findClosestDriverMarker() {
  retrieveRiderOriginLatLong();
  // for (var driver in driverArray) {
  for (let i = 0; i < driverArray.length; i++) {
    distanceBetweenTwoCoord(riderCurrentLat, riderCurrentLng, driverArray[i][1], driverArray[i][2]).then(function(response) {
      var results = response.rows[0].elements;
      return results[0];
    }).done(function(distanceMatrixResult) {
      //var myString = "distance is: " + distanceMatrixResult;
      // do something with your string now
      console.log(distanceMatrixResult);
      if (distanceMatrixResult.distance.value < closestDistance) {
        closestDistance = distanceMatrixResult.distance.value;
        closestDriverID = driverArray[i][0];
        closestDriverMinutes = distanceMatrixResult.duration.value;
        closestDriverLat = driverArray[i][1];
        closestDriverLng = driverArray[i][2];
      }
      // console.log("Closest Driver: " + closestDriverID);
      // console.log("Closest Distance: " + closestDistance);
    });
  }
}

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