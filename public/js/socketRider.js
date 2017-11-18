
var socket = io();
var map;
var riderID;

function getMapView(newId){
	console.log('initialize socket io-client');
	riderID = newId;
	console.log(riderID);
	socket.emit('rider view');
};

//modify this method later to pass the data to insert into rides table
function notifyDriver(data){
	console.log('notifying driver');
	console.log(data);
	socket.emit('ride request', data);
}

function searchDriver(data){
	console.log('looking for driver');
	socket.emit('active rides',data);
}

function notifyOthersOfCarpool(data) {
	socket.emit('notify carpool', data);
}

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
    	var driverSeats = data[i].seats;
		console.log(driverId);
		console.log(driverLong);
		console.log(driverLat);
    insertNewDriverMarker(driverId, driverLat, driverLong, driverSeats);
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
				var closest = getRiderInfo(data);
			}
		});
		// setTimeout(function() {
		// 	var canCarpool = returnCarpoolBoolean();
		// 	console.log(canCarpool);
		//
		// 	if(canCarpool) {
		// 		//notify driver for carpool
		// 		getRiderInfoCarpool(data[0].driverid);
		// 		// notifyOthersOfCarpool(data);
		// 	} else {
		// 		//find closest marker and notify
		// 		var closest = getRiderInfo();
		// 	}
		// },2000);
 	}



	// data that comes in
	// driverid: 1000,
	// riderid: 1001,
	// dest_long: 37.6213129,
	// dest_lat: -122.3789554,
	// start_long: 37.4418834,
	// start_lat: -122.14301949999998,
	// cost: 43.85,
	// carpool: 0,
	// time: 22 } ]


	//carpool logic
	//-notifyDriver
});

socket.on('find nearest', function(data){
	if(data.riderID == riderID){
		console.log('find nearest driver...');
		console.log(data);
		// setTimeout(function() {
		console.log('getting rider info data...');
		console.log(data);
		var closest = getRiderInfo(data);
		// },2000);
	}
});

