
var socket = io();
var map;
var riderID;

function getMapView(newId){
	console.log('initialize socket io-client');
	riderID = newId;
	console.log(riderID);
	socket.emit('rider view');
}

//modify this method later to pass the data to insert into rides table
function notifyDriver(data){
	console.log('notifying driver');
	console.log(data);
	alert("Ride Found, Notifying Your Driver Now");
	socket.emit('ride request', data);
}

function searchDriver(data){
	console.log('looking for driver');
	console.log(data);
	var getClosestDriverDataPromise = getClosestDriverData(data);
	getClosestDriverDataPromise.then(function(result) {
		console.log('result...');
		console.log(result);
		if(result.closestDriverId > 0) {
			data['closestdriverid'] = result.closestDriverId;
			socket.emit('find closest', data);
		} else {
			alert("No Drivers With Enough Seats");
			location.reload();
      return;
		}
	});
}

function notifyOthersOfCarpool(data) {
	socket.emit('notify carpool', data);
}

//approach 2: update database
function updateSeatIO(data){
	socket.emit('update seats db', data);
}

socket.on('update seats',function(data){
	removeDriverMarker(data.id);
	getMapView(riderID);
});
socket.on('second rider', function(data) {
	if(data.rider1 == riderID || data.rider2 == riderID) {
		console.log("second rider socket socketrider");
		firstRiderDiscount();
		alert("There will be a second rider joining you, you will receive $5 off your ride");
	}
});

socket.on('map view', function (data){
	console.log("got a response")
	console.log(data);
  	for(var i = 0; i < data.length; i++) {
		var driverId = data[i].id;
    	var driverLong = data[i].current_long;
    	var driverLat = data[i].current_lat;
    	var driverSeats = data[i].availableseats;
		console.log(driverId);
		console.log(driverLong);
		console.log(driverLat);
		console.log(driverSeats);
	removeDriverMarker(driverId);
	if(driverSeats > 0 ){
		insertNewDriverMarker(driverId, driverLat, driverLong, driverSeats);
	}
  }
});

socket.on('ride completed', function(data){
  if(data.riderID = riderID){
  	removeDriverMarker(data.id);
  	alert('Ride Completed');
  }
});

socket.on('update map', function(){
	getMapView(riderID);
});



socket.on('search carpool', function(data){
console.log("in search carpool");
console.log(data[0].riderid);
console.log(riderID);
	if(data[0].riderid != riderID){
 		console.log('searching for carpool.....');
		console.log("data coming into search carpool");
		console.log(data);
		console.log(data[0].start_lat);
		console.log(data[0].start_long);
		console.log(data[0].dest_lat);
		console.log(data[0].dest_long);
		console.log(data[0].driverid);
		var checkCarpoolFunctionPromise = checkCarpoolFunction(data[0].start_lat, data[0].start_long, data[0].dest_lat, data[0].dest_long);
		checkCarpoolFunctionPromise.then(function(result) {
			console.log(result);
			if(result) {
				getRiderInfoCarpool(data);
			} else {

				var changedData = {
		      'driverid': data[0].driverid,
		      'riderLat': data[0].start_lat,
		      'riderLng': data[0].start_long,
		      'destinationLat': data[0].dest_lat,
		      'destinationLng': data[0].dest_long,
		      'riderid': data[0].riderid,
		      'cost': data[0].cost,
		      'carpool': data[0].carpool,
		      'duration': data[0].time
					// ,
		      // 'seats': ????
		    };

				var closest = getRiderInfo(changedData);
			}
		});
 	}

	// data that comes in data[0].
	//   driverid: 1000,
  //   riderid: 1002,
  //   dest_long: -122.3789554,
  //   dest_lat: 37.6213129,
  //   start_long: -121.88107150000002,
  //   start_lat: 37.3351874,
  //   cost: 79.63,
  //   carpool: 0,
  //   time: 37 } ]

});

socket.on('find nearest', function(data){
	console.log(data);
	console.log("data.riderId is " + data.riderID);
	console.log("riderID is " + riderID);
	if(data.riderID == riderID){
		console.log('find nearest driver...');
		// setTimeout(function() {
		console.log('getting rider info data...');
		console.log(data);
		var closest = getRiderInfo(data);
		// },2000);
	}
});
