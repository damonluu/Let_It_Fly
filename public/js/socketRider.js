
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
	if(data.riderID ==riderID){
		console.log('searching for carpool.....');
		console.log(data);
	}
	//carpool logic
	//-notifyDriver
});

socket.on('find nearest', function(data){
	if(data.riderID ==riderID){
		console.log('find nearest driver...');
		console.log(data);
		// setTimeout(function() {
		var closest = getRiderInfo();
		// },2000);
	}

	//1.find closest driver
	//2.Notify the closest driver
})
