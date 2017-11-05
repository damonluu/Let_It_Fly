var markers = [];
var timeOut = 5000;
var mymap;
var driverArray = [];
var riderCurrentLat;
var riderCurrentLng;

var marker_image = new google.maps.MarkerImage(
  "./images/vanMed.png"
);

// var driverArray = [
//   ['SJSU', 37.3352, -121.8811],
//   ['Milpitas', 37.4323, -121.8996],
//   ['Hayward', 37.6688, -122.0808],
//   ['San Mateo', 37.5630, -122.3255],
//   ['Palo Alto', 37.4419, -122.1430]
// ];

function retrieveRiderOriginLatLong() {
  var latLng = getRiderOriginLatLong();
  riderCurrentLat = latLng[0];
  riderCurrentLng = latLng[1];
}


// driverArray['SJSU'] = [37.3352, -121.8811];
// driverArray['Milpitas'] = [37.4323, -121.8996];
// driverArray['Hayward'] = [37.6688, -122.0808];
driverArray.push(["SJSU", 37.3352, -121.8811]);
driverArray.push(["Milpitas", 37.4323, -121.8996]);
driverArray.push(["Hayward", 37.6688, -122.0808]);


function showDriverMarker(map) {
  mymap = map;
  setMarkers(driverArray);
  // timeOut = setInterval(function() {
  //   reloadMarkers();
  // }, 5000);
}

function insertNewDriverMarker(driverId, lat, lng) {
  var myLatLng = new google.maps.LatLng(lat, lng);
  var marker = new google.maps.Marker({
    position: myLatLng,
    map: mymap,
    animation: google.maps.Animation.DROP,
    icon: marker_image,
    title: driverId,
  });
  // markers[driverId] = marker;
  // driverArray[driverId] = [lat, lng];
  markers.push(marker);
  driverArray.push([driverId, lat, lng]);
  console.log("Inserted " + driverId + " to markers");
}

function removeDriverMarker(driverId) {
  console.log("Removed " + driverId + " from markers");
  for(var i = 0; i < markers.length; i++) {
    if(markers[i].title == driverId) {
      console.log("Driver to remove: " + driverId);
      markers[i].setMap(null);
      // delete markers[i];
      markers.splice(i,1);
    }
  }

  for(var i = 0; i < driverArray.length; i++) {
    if(driverArray[i][0] == driverId) {
      // delete driverArray[i];
      driverArray.splice(i,1);
    }
  }
  // markers[driverId].setMap(null);
  // delete markers[driverId];
  // delete driverArray[driverId];
}

function stopAutoUpdate() {
  clearTimeout(timeOut);
  removeMarkers();
}

function setMarkers(locations) {
  for (var i = 0; i < driverArray.length; i++) {
    var drivers = locations[i];
    // console.log(drivers);
    var myLatLng = new google.maps.LatLng(drivers[1], drivers[2]);
    var marker = new google.maps.Marker({
      position: myLatLng,
      map: mymap,
      animation: google.maps.Animation.DROP,
      icon: marker_image,
      title: drivers[0],
    });

    // Push marker to markers array
    // markers[driver] = marker;
    markers.push(marker);
  }
}

function removeMarkers(driverId) {
  // Loop through markers and set map to null for each
  for (var i = 0; i < markers.length; i++) {
    markers[i].setMap(null);
  }
  // Reset the markers array
  markers = [];
}

function reloadMarkers() {
  removeMarkers();
  // Call set markers to re-add markers
  setMarkers(driverArray);
}


function distanceBetweenTwoCoord(originLat, originLng, destinationLat, destinationLng) {
  // console.log(originLat);
  // console.log(originLng);
  // console.log(destinationLat);
  // console.log(destinationLng);
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
  console.log("The Driver is " + (closestDistance/1609.34).toFixed(1) + " Miles Away");
  console.log("The Driver is " + (closestDriverMinutes/60).toFixed(0) + " Minutes Away");

}

var confirmButton = document.getElementById('confirm');
confirmButton.onclick = function() {
  displayStepByStep();
  findClosestDriverMarker();
  setTimeout(function() { test() }, 2000);

}

var closestDistance = 999999;
var closestDriverID = 'hello';
var closestDriverMinutes = 9999;

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
      }
      // console.log("Closest Driver: " + closestDriverID);
      // console.log("Closest Distance: " + closestDistance);
    });
  }

}

// below is for testing

setTimeout(function() {
  insertNewDriverMarker('Sunnyvale', 37.3688, -122.0363);
}, 3000);
setTimeout(function() {
  removeDriverMarker('Hayward');
}, 4000);
