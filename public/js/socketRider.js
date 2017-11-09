
var socket = io();
var map;

function getMapView(){
	console.log('initialize socket io-client');
	socket.emit('rider view');
};

//modify this method later to pass the data to insert into rides table
function notifyDriver(data){
	console.log('notifying driver');
	socket.emit('ride request', data);
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

socket.on('update map', function(){
	getMapView();
});
