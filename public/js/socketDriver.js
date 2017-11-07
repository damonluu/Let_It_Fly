var socket = io();
// var test2 = ['hello', 'hi'];
socket.on('connect', function() {
  document.getElementById("submit-button").addEventListener("click", function() {
    socket.emit("clicked");
  });
});
socket.on('clicked', function() {
  console.log('clicked');
  document.getElementById("alert").innerHTML = "button clicked";
});
