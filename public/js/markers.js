var markers = [];
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

function showDriverMarker(map) {
  mymap = map;
  setMarkers(driverArray);
}

function insertNewDriverMarker(driverId, lati, long) {
  // var myLatLng = new google.maps.LatLng(lat, lng);
  var marker = new google.maps.Marker({
    position: {
      lat: lati,
      lng: long
    },
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
}

function setMarkers(locations) {
  for (var i = 0; i < driverArray.length; i++) {
    var drivers = locations[i];
    console.log(drivers);
    console.log(drivers[1]);
    console.log(drivers[2]);
    // console.log(drivers);
    //var myLatLng = new google.maps.LatLng(drivers[1], drivers[2]);
    var marker = new google.maps.Marker({
      position: {
        lat: drivers[1],
        lng: drivers[2]
      },
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
  // retrieveRiderOriginLatLong();
  var deferred = $.Deferred();

  var latLng = getRiderOriginLatLong();
  riderCurrentLat = latLng[0];
  riderCurrentLng = latLng[1];
  console.log("HERE");
  console.log(latLng);
  // for (var driver in driverArray) {
  for (let i = 0; i < driverArray.length; i++) {
    var distanceBetweenTwoCoordPromise = distanceBetweenTwoCoord(riderCurrentLat, riderCurrentLng, driverArray[i][1], driverArray[i][2]);
    distanceBetweenTwoCoordPromise.then(function(result) {
      if (result.rows[0].elements[0].distance.value < closestDistance) {
        closestDistance = result.rows[0].elements[0].distance.value;
        closestDriverID = driverArray[i][0];
        closestDriverMinutes = result.rows[0].elements[0].duration.value;
        closestDriverLat = driverArray[i][1];
        closestDriverLng = driverArray[i][2];
      }
      var results = result.rows[0].elements[0];
      // return results[0];
      deferred.resolve(results);
    });
  }
  return deferred.promise();
}

function carpoolHelper(theDriverId) {
  var deferred = $.Deferred();

  var latLng = getRiderOriginLatLong();
  riderCurrentLat = latLng[0];
  riderCurrentLng = latLng[1];
  // console.log("HERE");
  // console.log(latLng);
  // console.log("in carpoolHelper");
  // console.log(riderCurrentLat);
  // console.log(riderCurrentLng);
  // console.log(driverLat);
  // console.log(driverLng);
  // console.log(driverArray);
  for (var i = 0; i < driverArray.length; i++) {
    if (driverArray[i][0] == theDriverId) {
      closestDriverLat = driverArray[i][1];
      closestDriverLng = driverArray[i][2];
      break;
    }
  }
  console.log(closestDriverLat);
  console.log(closestDriverLng);

  var distanceBetweenTwoCoordPromise = distanceBetweenTwoCoord(riderCurrentLat, riderCurrentLng, closestDriverLat, closestDriverLng);
  distanceBetweenTwoCoordPromise.then(function(result) {
    closestDriverId = theDriverId;
    closestDistance = result.rows[0].elements[0].distance.value;
    closestDriverMinutes = result.rows[0].elements[0].duration.value;
    deferred.resolve(result);
  });
  return deferred.promise();
}

function test2(theDriverId) {
  console.log("The Driver is " + (closestDistance / 1609.34).toFixed(1) + " Miles Away");
  console.log("The Driver is " + (closestDriverMinutes / 60).toFixed(0) + " Minutes Away");
  // stopAutoUpdate();
  // removeMarkersExcept(closestDriverID);

  var resultData = [];
  resultData["closestDriverId"] = theDriverId;
  resultData["closestDistance"] = (closestDistance / 1609.34).toFixed(1);
  resultData["closestDriverMinutes"] = (closestDriverMinutes / 60).toFixed(0);
  resultData["closestDriverLat"] = closestDriverLat;
  resultData["closestDriverLng"] = closestDriverLng;
  return resultData;
}
