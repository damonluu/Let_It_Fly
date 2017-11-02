/**
 * @constructor
 */
function AutocompleteDirectionsHandler(map) {
    this.map = map;
    this.originPlaceId = null;
    this.carpoolPlaceId = null;
    this.destinationPlaceId = null;
    this.travelMode = 'DRIVING';
    var originInput = document.getElementById('origin-input');
    var carpoolInput = document.getElementById('carpool-input');
    var destinationInput = document.getElementById('destination-input');
    var submitButton = document.getElementById('submit-button');
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.directionsDisplay.setMap(map);
    this.directionsDisplay.setPanel(document.getElementById('directionsPanel'));


    var originAutocomplete = new google.maps.places.Autocomplete(
        originInput, {
            placeIdOnly: true
        });
    var carpoolAutocomplete = new google.maps.places.Autocomplete(
        carpoolInput, {
            placeIdOnly: true
        });
    var destinationAutocomplete = new google.maps.places.Autocomplete(
        destinationInput, {
            placeIdOnly: true
        });
        
    submitButton.onclick = function () {
        location.href = "#openModal";
    };



    this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
    this.setupPlaceChangedListener(carpoolAutocomplete, 'PICK');
    this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');

    this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(originInput);
    this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(carpoolInput);
    this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(destinationInput);
    this.map.controls[google.maps.ControlPosition.LEFT_TOP].push(submitButton);
}


AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
    var me = this;
    autocomplete.bindTo('bounds', this.map);
    autocomplete.addListener('place_changed', function() {
        var place = autocomplete.getPlace();

        if (!place.place_id) {
            window.alert("Please select an option from the dropdown list.");
            return;
        }
        if (mode === 'ORIG') {
            me.originPlaceId = place.place_id;
            getGeocode(me.originPlaceId);

        } else if (mode === 'PICK'){
            me.carpoolPlaceId = place.place_id;
            getGeocode(me.carpoolPlaceId);
        } else {
            me.destinationPlaceId = place.place_id;
            getGeocode(me.destinationPlaceId);
        }
        me.route();
    });

}

AutocompleteDirectionsHandler.prototype.route = function() {
    if (!this.originPlaceId || !this.destinationPlaceId) {
        return;
    }

    //EITHER ORIGIN OR DESTINATION MUST BE AIRPORT, CANNOT BE NEAR AIRPORT LIKE THE LUGGAGE PICK UP LOCATION
    var airportPlaceId = validAirportPlace();
    if (airportPlaceId.includes(this.originPlaceId) || airportPlaceId.includes(this.destinationPlaceId)) {
      var me = this;

      var waypts = [];
      waypts.push({
        location: {placeId: this.carpoolPlaceId},
        stopover: true
      });

      this.directionsService.route({
          origin: {
              'placeId': this.originPlaceId
          },
          waypoints: waypts,
          destination: {
              'placeId': this.destinationPlaceId
          },
          travelMode: this.travelMode
      }, function(response, status) {
          if (status === 'OK') {
              me.directionsDisplay.setDirections(response);
              console.log("~~~~~~~~~~~~~~~~~~~~~");
              // console.log("distance: " + response.routes[0].legs[0].distance.text);
              // console.log("duration: " + response.routes[0].legs[0].duration.text);
              // console.log("main road taken: " + response.routes[0].summary);
              // console.log("Distance between origin and destination");
              // console.log(distanceTwoPoints(response.geocoded_waypoints[0].place_id, response.geocoded_waypoints[2].place_id));
              console.log("Distance between three");
              console.log(distanceThreePoints(response.geocoded_waypoints[0].place_id, response.geocoded_waypoints[1].place_id, response.geocoded_waypoints[2].place_id));
              console.log("~~~~~~~~~~~~~~~~~~~~~");
              // alert("hello");
              // $('#openModal').modal('show');
          } else {
              window.alert('Directions request failed due to ' + status);
          }
      });
    } else {
        alert("Either the origin or destination must be an airport (SFO, SJC, or OAK)");
        location.reload();
    }
}

function getAddressFromLatLang(lat, lng, geocoder) {
    //console.log("Entering getAddressFromLatLang()");
    var latLng = new google.maps.LatLng(lat, lng);
    geocoder.geocode({
        'latLng': latLng
    }, function(results, status) {
        //console.log("After getting address");
        //console.log(results);
        if (status == google.maps.GeocoderStatus.OK) {
            if (results[0]) {
                console.log(results[0].formatted_address);
                console.log("County: " + findCounty(results));
                //alert(results[0].formatted_address);
            }
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }

    });
    //console.log("Exiting getAddressFromLatLang()");
}

function findCounty(results) {
    var filtered_array = results[0].address_components.filter(function(address_component) {
        return address_component.types.includes("administrative_area_level_2");
    });
    var county = filtered_array.length ? filtered_array[0].long_name : "";
    if (!validCounty(county)) {
        alert("Out of County Boundaries, Please Enter a Different location");
        //document.getElementById('origin-input').value = "";
        //document.getElementById('destination-input').value = "";
        location.reload();
    }
    return county;
}

function validCounty(county) {
    return county == 'Alameda County' || county == 'San Mateo County' || county == 'Santa Clara County';
}

function getGeocode(placeid) {
    //array to store the latitude and longitude
    var loc = [];
    // create a new Geocoder object
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({
        'placeId': placeid
    }, function(results, status) {
        // and this is function which processes response
        if (status == google.maps.GeocoderStatus.OK) {
            loc[0] = results[0].geometry.location.lat();
            loc[1] = results[0].geometry.location.lng();

            //alert(loc); // the place where loc contains geocoded coordinates
            getAddressFromLatLang(loc[0], loc[1], geocoder);

        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
}

//array of place ids of airports, including some nearby stuff like cellphone lots, parking, baggage pickup locations
//see google drive for name of each id
function validAirportPlace() {
    var valid = ["ChIJm8Wz-sPLj4ARPn72bT9E-rw", "ChIJybx_mpXLj4ARTo8TPGOw-bY", "ChIJU7sQ6-rLj4ARFcjeauLjF3A",
        "ChIJJbnd98DLj4ARnLWlNvkZ1jI", "ChIJ5wkY0JXLj4AR4yF_zytyXvs", "ChIJoR7aAZfLj4AR-7b2EMStvE8",
        "ChIJh7we-cDLj4ARwFUYEHuH6rw", "ChIJ4Xj0hpbLj4AR_Qf9DzSCHVQ", "ChIJyRLmLcDLj4ARMKyoKkBXzV4",
        "ChIJVVVVVYx3j4ARP-3NGldc8qQ", "ChIJV2Q04pN3j4ARu9rOcaf5UjU", "ChIJUd3-8JB3j4ARZePhlvmYnvc",
        "ChIJnS-7y5J3j4AR6Qg6UFa9NGE", "ChIJbbaCeJF3j4ARo5zcvfJQ4es", "ChIJ55z15yp4j4ARoVWFukbgzwo",
        "ChIJbZs2Iy14j4ARbN3n5O9iFK8", "ChIJAwAv_cx5j4ARlXfukuZqOQE", "ChIJTZ0XOSt4j4ARnuPuVs1AH6Y",
        "ChIJVVVVVYx3j4ARyN7qnq2JceQ", "ChIJQabAAlSEj4ARYHQBAw8MY7A", "ChIJu0En3QSFj4ARx_cFCHMV6z0",
        "ChIJLd7if6GFj4ARiHWhAH2cTaU", "ChIJYb6-0gSFj4ARADjUgrDzB8k", "ChIJn4zqsQaFj4ARnTOR7vEnmcA",
        "ChIJCQq50rWFj4AR4bo5FthEzXU", "ChIJY0qG2giFj4ARtshexOmLHO4"
    ];
    return valid;
}

// function distanceTwoPoints(origin_PlaceId, destination_PlaceId) {
//     var formData = {};
//     var directionsService = new google.maps.DirectionsService();
//     var directionsRequest = {
//         origin: {
//             placeId: origin_PlaceId
//         },
//         destination: {
//             placeId: destination_PlaceId
//         },
//         travelMode: "DRIVING"
//     }
//
//     directionsService.route(directionsRequest, function(response, status) {
//         if (status == google.maps.GeocoderStatus.OK) {
//             // formData.originPlaceId = response.request.origin.placeId;
//             // formData.destinationPlaceId = response.request.destination.placeId;
//             formData.distance = (response.routes["0"].legs["0"].distance.value / 1609.34).toFixed(1);
//             // formData.duration = (response.routes["0"].legs["0"].duration.value / 60).toFixed(0);
//
//         } else {
//             alert("Geocode was not successful for the following reason: " + status);
//         }
//     });
//     return formData;
// }

function distanceThreePoints(origin_PlaceId, carpool_PlaceId, destination_PlaceId) {
    var formData = {};
    var directionsService = new google.maps.DirectionsService();

    var waypts = [];
    waypts.push({
      location: {placeId: carpool_PlaceId},
      stopover: true
    });

    var directionsRequest = {
        origin: {
            placeId: origin_PlaceId
        },
        waypoints: waypts,
        destination: {
            placeId: destination_PlaceId
        },
        travelMode: "DRIVING"
    }

    directionsService.route(directionsRequest, function(response, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            // formData.originPlaceId = response.request.origin.placeId;
            // formData.destinationPlaceId = response.request.destination.placeId;
            formData.carpool = ((response.routes["0"].legs["0"].distance.value + response.routes["0"].legs["1"].distance.value)/ 1609.34).toFixed(1);
            var temp = ((response.routes["0"].legs["0"].distance.value + response.routes["0"].legs["1"].distance.value)/ 1609.34).toFixed(1);
            // console.log("first");
            // console.log(response);
            directionsRequest = {
                origin: {
                    placeId: origin_PlaceId
                },
                destination: {
                    placeId: destination_PlaceId
                },
                travelMode: "DRIVING"
            }
            directionsService.route(directionsRequest, function(response, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    // formData.originPlaceId = response.request.origin.placeId;
                    // formData.destinationPlaceId = response.request.destination.placeId;
                    formData.direct = (response.routes["0"].legs["0"].distance.value / 1609.34).toFixed(1);
                    var temp2 = (response.routes["0"].legs["0"].distance.value / 1609.34).toFixed(1);
                    // formData.duration = (response.routes["0"].legs["0"].duration.value / 60).toFixed(0);
                    // console.log("second");
                    // console.log(response);
                    // console.log(temp);
                    // console.log(temp2);
                    // console.log(temp2-temp);
                    if(Math.abs(temp2 - temp) > 2) {
                      alert("Carpooler is further than 1 mile from path, don't pick up");
                      location.reload();
                    }

                } else {
                    alert("Geocode was not successful for the following reason: " + status);
                }
            });
            // formData.duration = (response.routes["0"].legs["0"].duration.value / 60).toFixed(0);

        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });

    // var directionsService2 = new google.maps.DirectionsService();
    // var directionsRequest = {
    //     origin: {
    //         placeId: origin_PlaceId
    //     },
    //     destination: {
    //         placeId: destination_PlaceId
    //     },
    //     travelMode: "DRIVING"
    // }

    // directionsService.route(directionsRequest, function(response, status) {
    //     if (status == google.maps.GeocoderStatus.OK) {
    //         // formData.originPlaceId = response.request.origin.placeId;
    //         // formData.destinationPlaceId = response.request.destination.placeId;
    //         formData.direct = (response.routes["0"].legs["0"].distance.value / 1609.34).toFixed(1);
    //         // formData.duration = (response.routes["0"].legs["0"].duration.value / 60).toFixed(0);
    //         console.log("second");
    //         console.log(response);
    //
    //     } else {
    //         alert("Geocode was not successful for the following reason: " + status);
    //     }
    // });

    if((formData.carpool - formData.direct) > 2) {
      alert("no carpool");
    }



    return formData;
}