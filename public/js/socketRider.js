
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

function searchDriver(){
	console.log('looking for driver');
	socket.emit('active rides');
}

socket.on('map view', function (data){
	console.log("got a response")
	console.log(data);
  	for(var i = 0; i < data.length; i++) {
		var driverId = data[i].id;
    	var driverLong = data[i].current_long;
    	var driverLat = data[i].current_lat;
		console.log(driverId);
		console.log(driverLong);
		console.log(driverLat);
    insertNewDriverMarker(driverId, driverLat, driverLong);
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
	console.log('searching for carpool.....');
	console.log("data coming into search carpool");
	console.log(data);
	console.log(data[0].start_lat);
	console.log(data[0].start_long);
	console.log(data[0].dest_lat);
	console.log(data[0].dest_long);
	console.log(data[0].driverid);
	checkCarpoolFunction(data[0].start_lat, data[0].start_long, data[0].dest_lat, data[0].dest_long)
	setTimeout(function() {
		var canCarpool = returnCarpoolBoolean();
		console.log(canCarpool);

		if(canCarpool) {
			//notify driver for carpool
			getRiderInfoCarpool(data[0].driverid);
		} else {
			//find closest marker and notify
			var closest = getRiderInfo();
		}
	},2000);

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
	console.log('find nearest driver...');
	// setTimeout(function() {
		var closest = getRiderInfo();
	// },2000);

	//1.find closest driver
	//2.Notify the closest driver
})
