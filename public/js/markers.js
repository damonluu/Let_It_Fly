var markers = [];
var mymap;
var driverArray = [];
var closestDistance = 999999;
var closestDriverID = 'IfYouSeeThisMarkerSomethingWentWrong';
var closestDriverMinutes = 9999;
var closestDriverLat;
var closestDriverLng;
var availableSeats = -1;

var marker_image = new google.maps.MarkerImage(
  "img/map/vanMed.png"
);

function showDriverMarker(map) {
  mymap = map;
  setMarkers(driverArray);
}

function insertNewDriverMarker(driverId, lati, long, seats) {
  // var myLatLng = new google.maps.LatLng(lat, lng);
  var marker = new google.maps.Marker({
    position: {
      lat: lati,
      lng: long,
    },
    map: mymap,
    animation: google.maps.Animation.DROP,
    icon: marker_image,
    title: driverId.toString()
  });
  // markers[driverId] = marker;
  // driverArray[driverId] = [lat, lng];
  driverArray.push([driverId, lati, long, seats]);
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
//approach 1: update markers
function updateMarker(driverId, newSeatNumber){
  console.log("Update " + driverId + "marker");
  console.log("Updated seasts " + newSeatNumber);
  var update;
  console.log(driverArray);
  for (var i = 0; i < driverArray.length; i++) {
    if (driverArray[i][0] == driverId) {
      driverArray[i][3] = newSeatNumber;
      update = driverArray[i];
    }
  }
  updateSeatIO(update);
  console.log("Updated Marker: " + driverArray);
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
  console.log("inside distanceBetweenTwoCoord....");
  console.log(originLat);
  console.log(originLng);
  console.log(destinationLat);
  console.log(destinationLng);
  service.getDistanceMatrix({
    origins: [{lat: originLat, lng: originLng}],
    destinations: [{lat: destinationLat, lng: destinationLng}],
    travelMode: 'DRIVING',
    unitSystem: google.maps.UnitSystem.METRIC
  }, callback);

  function callback(response, status) {
    if (status == 'OK') {
      dfd.resolve(response);
    } else {
      dfd.reject(status);
    }
  }
  return dfd.promise();
}

function test() {
  console.log("The Closest Driver ID Is: " + closestDriverID);
  console.log("The Driver is " + (closestDistance / 1609.34).toFixed(1) + " Miles Away");
  console.log("The Driver is " + (closestDriverMinutes / 60).toFixed(0) + " Minutes Away");
  // stopAutoUpdate();
  removeMarkersExcept(closestDriverID);

  var resultData = {};
  resultData["closestDriverId"] = closestDriverID;
  resultData["closestDistance"] = (closestDistance / 1609.34).toFixed(1);
  resultData["closestDriverMinutes"] = (closestDriverMinutes / 60).toFixed(0);
  resultData["closestDriverLat"] = closestDriverLat;
  resultData["closestDriverLng"] = closestDriverLng;
  resultData["availableSeats"] = availableSeats;

  return resultData;
}

function getClosestDriverData(data) {
  var deferred = $.Deferred();
  var findClosestDriverMarkerPromise = findClosestDriverMarker(data);
	findClosestDriverMarkerPromise.then(function(result) {
    console.log("The Closest Driver ID Is: " + closestDriverID);
    console.log(closestDistance);
    console.log(closestDriverMinutes);
    console.log("The Driver is " + (closestDistance / 1609.34).toFixed(1) + " Miles Away");
    console.log("The Driver is " + (closestDriverMinutes / 60).toFixed(0) + " Minutes Away");

    var resultData = {};
    resultData['closestDriverId'] = closestDriverID;
    resultData["closestDistance"] = (closestDistance / 1609.34).toFixed(1);
    resultData["closestDriverMinutes"] = (closestDriverMinutes / 60).toFixed(0);
    resultData["closestDriverLat"] = closestDriverLat;
    resultData["closestDriverLng"] = closestDriverLng;
    resultData["availableSeats"] = availableSeats;
    console.log('inside getClosestDriverData....');
    console.log(resultData);
    deferred.resolve(resultData);
	});
  return deferred.promise();
}

function findClosestDriverMarker(data) {
  var deferred = $.Deferred();
  console.log("inside findClosestDriverMarker.....");
  console.log(data);

  for (let i = 0; i < driverArray.length; i++) {
    var distanceBetweenTwoCoordPromise
    if(data.riderLat !== undefined){
      distanceBetweenTwoCoordPromise = distanceBetweenTwoCoord(data.riderLat, data.riderLng, driverArray[i][1], driverArray[i][2]);
    } else {
      distanceBetweenTwoCoordPromise = distanceBetweenTwoCoord(data[0].start_lat, data[0].start_long, driverArray[i][1], driverArray[i][2]);
    }
    
    distanceBetweenTwoCoordPromise.then(function(result) {
      console.log(result);
      if (result.rows[0].elements[0].distance.value < closestDistance && data.seats <= driverArray[i][3]) {
        closestDistance = result.rows[0].elements[0].distance.value;
        closestDriverID = driverArray[i][0];
        closestDriverMinutes = result.rows[0].elements[0].duration.value;
        closestDriverLat = driverArray[i][1];
        closestDriverLng = driverArray[i][2];
        availableSeats = driverArray[i][3];
      }
      var results = result.rows[0].elements[0];
      // return results[0];
      if(i == driverArray.length-1) {
        deferred.resolve(results);
      }
    });
  }
  return deferred.promise();
}
function carpoolHelper(data) {
  var deferred = $.Deferred();

  console.log('carpoolHelper')
  console.log(driverArray);
  console.log(data);
  for (var i = 0; i < driverArray.length; i++) {
    if (driverArray[i][0] == data[0].driverid) {
      closestDriverLat = driverArray[i][1];
      closestDriverLng = driverArray[i][2];
      availableSeats = driverArray[i][3];
      break;
    }
  }
  console.log(closestDriverLat);
  console.log(closestDriverLng);
  console.log(availableSeats);

  var distanceBetweenTwoCoordPromise = distanceBetweenTwoCoord(data[0].start_lat, data[0].start_long, closestDriverLat, closestDriverLng);
  distanceBetweenTwoCoordPromise.then(function(result) {
    closestDriverId = data[0].driverid;
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

  var resultData = {};
  resultData["closestDriverId"] = theDriverId;
  resultData["closestDistance"] = (closestDistance / 1609.34).toFixed(1);
  resultData["closestDriverMinutes"] = (closestDriverMinutes / 60).toFixed(0);
  resultData["closestDriverLat"] = closestDriverLat;
  resultData["closestDriverLng"] = closestDriverLng;
  resultData["availableSeats"] = availableSeats;
  return resultData;
}
