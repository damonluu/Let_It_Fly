var markers = [];

var driverArray = [
  ['SJSU', 37.3352, -121.8811],
  ['Milpitas', 37.4323, -121.8996],
  ['Hayward', 37.6688, -122.0808],
  ['San Mateo', 37.5630, -122.3255],
  ['Palo Alto', 37.4419, -122.1430]
];

var mymap;

function insertNewMarker(latitude, longitude){
  var marker = new google.map.Marker({
    position: {lat: latitude, lng: longitude},
    map: mymap
  })
};

function addDriverMarker(map) {
  mymap = map;
  setMarkers(driverArray);
  setInterval(function() {
  reloadMarkers();
}, 5000);

};

function setMarkers(locations) {

  for (var i = 0; i < locations.length; i++) {
    var drivers = locations[i];
    var myLatLng = new google.maps.LatLng(drivers[1], drivers[2]);
    var marker = new google.maps.Marker({
      position: myLatLng,
      map: mymap,
      animation: google.maps.Animation.DROP,
      title: drivers[0],
    });

    // Push marker to markers array
    markers.push(marker);
  }
}

function reloadMarkers(){

    // Loop through markers and set map to null for each
    for (var i=0; i<markers.length; i++) {
        markers[i].setMap(null);
    }

    // Reset the markers array
    markers = [];

    // Call set markers to re-add markers
    setMarkers(driverArray);
}
