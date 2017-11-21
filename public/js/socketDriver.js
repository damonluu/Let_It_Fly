var socket = io();
var driverID;
// socket.on('map view', function(data) {
//   console.log('clicked');
//   // console.log(data);
//   // document.getElementById("alert").innerHTML = "button clicked";
// });

function addDriver(data) {
  console.log(data.id);
  console.log(data.lat);
  console.log(data.long);
  console.log(data.available);
  console.log(data.seats);
  driverID = data.id;
  insertNewDriverMarker(data.id, data.lat, data.long, data.seats);
  console.log("test");
  socket.emit("new driver", data);
}

function removeDriver(data) {
  console.log("Remove Driver: " + data.id);
  removeDriverMarker(data.id);
  alert("Ride Complete, Going Back To Dash Board");
  socket.emit("remove driver", data);
  parent.window.location.href = 'http://localhost:1600/dashboard#/userID:' + data.id;
}


socket.on("new rider", function(data) {
  if (data.driverID == driverID) {
    console.log('got new notification');
    directionToRider(data)
  }
})

socket.on('second rider', function(data) {
  if (data.driverID == driverID) {
    console.log("second rider socket socketrider");
    alert("There will be a second rider, giving you directions to them now");
  }
});
