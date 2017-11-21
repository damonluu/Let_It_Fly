var socket = io();
var map;
var riderID;

function getMapView(newId) {
  console.log('initialize socket io-client');
  riderID = newId;
  console.log(riderID);
  socket.emit('rider view');
}

//modify this method later to pass the data to insert into rides table
function notifyDriver(data) {
  console.log('notifying driver');
  console.log(data);
  alert("Ride Found, Notifying Your Driver Now");
  socket.emit('ride request', data);
}

function searchDriver(data) {
  if (data.riderID = riderID) {
    console.log('looking for driver');
    console.log(data);
    if (markers.length > 0) {
      var getClosestDriverDataPromise = getClosestDriverData(data);
      getClosestDriverDataPromise.then(function(result) {
        console.log('result...');
        console.log(result);
        if (result.closestDriverId > 0) {
          data['closestdriverid'] = result.closestDriverId;
          socket.emit('find closest', data);
        } else {
          alert("No Drivers With Enough Seats");
          location.reload();
          return;
        }
      });
    } else {
      alert('There is no driver available at the moment');
    }
  }
}

function notifyOthersOfCarpool(data) {
  socket.emit('notify carpool', data);
}

//approach 2: update database
function updateSeatIO(data) {
  socket.emit('update seats db', data);
}

socket.on('update seats', function(data) {
  removeDriverMarker(data.id);
  getMapView(riderID);
});
socket.on('second rider', function(data) {
  if (data.rider1 == riderID || data.rider2 == riderID) {
    console.log("second rider socket socketrider");
    firstRiderDiscount();
    alert("There will be a second rider joining you, you will receive $5 off your ride");
  }
  removeDriverMarker(data.driverID);
});

socket.on('map view', function(data) {
  console.log("got a response")
  console.log(data);
  for (var i = 0; i < data.length; i++) {
    var driverId = data[i].id;
    var driverLong = data[i].current_long;
    var driverLat = data[i].current_lat;
    var driverSeats = data[i].availableseats;
    console.log(driverId);
    console.log(driverLong);
    console.log(driverLat);
    console.log(driverSeats);
    removeDriverMarker(driverId);
    if (driverSeats > 0) {
      insertNewDriverMarker(driverId, driverLat, driverLong, driverSeats);
    }
  }
});

socket.on('ride completed', function(data) {
  if (data.rider1 == riderID || data.rider2 == riderID) {
    removeDriverMarker(data.id);
    alert('Ride Completed, Going Back To Dashboard');
    parent.window.location.href = 'http://localhost:1600/dashboard#/userID:' + riderID;
  }
});

socket.on('update map', function() {
  getMapView(riderID);
});

socket.on('search carpool', function(data) {
  // console.log(data);
  if (data[0].carpoolRequesterId == riderID) {
    // console.log("in search carpool");
    // console.log(data[0].riderid);
    // console.log(riderID);
    // console.log('searching for carpool.....');
    // console.log("data coming into search carpool");
    // console.log(data);
    // console.log(data[0].start_lat);
    // console.log(data[0].start_long);
    // console.log(data[0].dest_lat);
    // console.log(data[0].dest_long);
    // console.log(data[0].driverid);
    var checkCarpoolFunctionPromise = checkCarpoolFunction(data[0].start_lat, data[0].start_long, data[0].dest_lat, data[0].dest_long);
    checkCarpoolFunctionPromise.then(function(result) {
      console.log(result);
      if (result) {
        getRiderInfoCarpool(data);
      } else {
        alert("The Riders Available Right Can Only Accept Carpool" +
          "\nYou Do Not Qualify For Carpooling (Too Far Away) SORRY");
        location.reload();
        return;
      }
    });
    // }
  }

});

socket.on('find nearest', function(data) {
  // console.log(data);
  // console.log("data.riderId is " + data.riderID);
  // console.log("riderID is " + riderID);
  if (data.riderID == riderID) {
    console.log('find nearest driver...');
    console.log('getting rider info data...');
    console.log(data);
    var closest = getRiderInfo(data);
  }
});
