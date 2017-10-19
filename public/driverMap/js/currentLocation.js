function gps(map) {

  var controlDiv = document.createElement('div');

  var firstChild = document.createElement('button');
  firstChild.style.backgroundColor = '#fff';
  firstChild.style.border = 'none';
  firstChild.style.outline = 'none';
  firstChild.style.width = '28px';
  firstChild.style.height = '28px';
  firstChild.style.borderRadius = '2px';
  firstChild.style.boxShadow = '0 1px 4px rgba(0,0,0,0.3)';
  firstChild.style.cursor = 'pointer';
  firstChild.style.marginRight = '10px';
  firstChild.style.padding = '0px';
  firstChild.title = 'Your Location';
  controlDiv.appendChild(firstChild);

  var secondChild = document.createElement('div');
  secondChild.style.margin = '5px';
  secondChild.style.width = '18px';
  secondChild.style.height = '18px';
  secondChild.style.backgroundImage = 'url(https://maps.gstatic.com/tactile/mylocation/mylocation-sprite-1x.png)';
  secondChild.style.backgroundSize = '180px 18px';
  secondChild.style.backgroundPosition = '0px 0px';
  secondChild.style.backgroundRepeat = 'no-repeat';
  secondChild.id = 'you_location_img';
  firstChild.appendChild(secondChild);

  google.maps.event.addListener(map, 'center_changed', function() {
    secondChild.style['background-position'] = '0 0';
  });

  firstChild.addEventListener('click', function() {
    var imgX = 0,
      animationInterval = setInterval(function() {
        imgX = -imgX - 18;
        secondChild.style['background-position'] = imgX + 'px 0';
      }, 500);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function(position) {
        var latlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);

        var marker = new google.maps.Marker({
          map: map,
          animation: google.maps.Animation.DROP
        });


        marker.setPosition(latlng);
        getAddressFromLatLang(position.coords.latitude, position.coords.longitude, marker)
        map.setCenter(latlng);
        clearInterval(animationInterval);
        secondChild.style['background-position'] = '-144px 0';
      });
    } else {
      clearInterval(animationInterval);
      secondChild.style['background-position'] = '0 0';
    }
  });

  function getAddressFromLatLang(lat, lng, marker) {
    console.log("Entering getAddressFromLatLang()");
    var geocoder = new google.maps.Geocoder();
    var latLng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({
      'latLng': latLng
    }, function(results, status) {
      console.log("After getting address");
      console.log(results);
      if (status == google.maps.GeocoderStatus.OK) {
        if (results[0]) {
          console.log(results[0].formatted_address);
          alert(results[0].formatted_address);
          var contentString = "<h3>You Are Here</h3>" + results[0].formatted_address;
          var infowindow = new google.maps.InfoWindow({
            content: contentString
          });

          marker.addListener('click', function() {
            infowindow.open(map, marker);
          });
        }
      } else {
        alert("Geocode was not successful for the following reason: " + status);
      }

    });
    console.log("Exiting getAddressFromLatLang()");
  }

  controlDiv.index = 1;
  map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(controlDiv);
}
