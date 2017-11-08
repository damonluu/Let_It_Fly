var socket = io();
// var test2 = ['hello', 'hi'];
// socket.on('connect', function() {
//   // queries for drivers before it gets inserted
//   document.getElementById("submit-button").addEventListener("click", function() {
//     activeDriver();
//     socket.emit("rider view");
//   });
// });
socket.on('map view', function(data) {
  console.log('clicked');
  // console.log(data);
  // document.getElementById("alert").innerHTML = "button clicked";
});

function addDriver(data){
  console.log(data.id);
  console.log(data.lat);
  console.log(data.long);
  console.log(data.available);
  socket.emit("new driver", data);
}
