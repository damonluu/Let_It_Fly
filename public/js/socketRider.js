
var socket = io();
var map;

function getMapView(){
	console.log('initialize socket io-client');
	socket.emit('rider view');
};

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

// socket.on('connect', function() {
//     document.getElementById("button").addEventListener("click", function() {
//       socket.emit("clickedTest");
//     });
//   });
//   socket.on('hello', function(data) {
//     console.log('clicked');
//     document.getElementById("alert").innerHTML = "button clicked";
//   });
