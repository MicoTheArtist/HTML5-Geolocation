var watchID;
var geo;
var map;
var mapMarker;

var MAXIMUM_AGE = 200;
var TIMEOUT = 300000;
var HIGHACCURACY = true;

function getGeoLocation(){
	try {
		return !!(navigator.geolocation) ? navigator.geolocation : undefined;	
	}
	catch(e) {
		return undefined;
	}
}

function show_map(position){
	var lat = position.coords.latitude;
	var lon = position.coords.longitude;
	var latlng = new google.maps.LatLng(lat, lon);
	
	var start = latlng;
	var end = "10 Deerwood East, Irvine, CA 92606";
	
	var directionDisplay; // add
	var directionsService = new google.maps.DirectionsService(); // add
	
	if (map) {
		map.panTo(latlng);	
		mapMarker.setPosition(latlng);
		directionsDisplay.setPanel(document.getElementById('directions-panel')); // add

        var request = {
          //origin: start,
          destination: end,
          travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
        directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
          }
        });

	}
	else {
		// options for map instance
		var myOptions = {
			zoom:19,
			center: latlng,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		
		// new map instance
		map = new google.maps.Map(document.getElementById('map_canvas'), myOptions);
		map.setTilt(0);
		
		// new marker instance
		mapMarker = new google.maps.Marker({
			position: latlng,
			title: "You are here."
		});
		mapMarker.setMap(map);
		
		directionsDisplay = new google.maps.DirectionsRenderer(); // add
		directionsDisplay.setMap(map); // add
        directionsDisplay.setPanel(document.getElementById('directions-panel')); // add
		
        var request = {
          origin: start,
          destination: end,
          travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
        directionsService.route(request, function(response, status) {
          if (status == google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
          }
        });


	}
}
function geo_error(error){
	stopWatching();
	switch (error.code) {
		case error.TIMEOUT:
			alert('Permission Timeout');
			break;
		case error.POSITION_UNAVAILBLE:
			alert('Geolocation Position Unavailable');
			break;
		case error.PERMISSION_DENIED:
			alert('Geolocation Permission Denied');
			break;
		default:
			alert('Geolocation Returned an undefined error code ' + error.code);
	}
}
function stopWatching(){
	!!(watchID) ? geo.clearWatch(watchID) : watchID = undefined;
}

function startWatching(){
	watchID = geo.watchPosition(show_map, geo_error, {
		enableHighAccuracy: HIGHACCURACY,
		maximumAge: MAXIMUM_AGE,
		timeout: TIMEOUT	
	});
}

window.onload = function(){
	!!(geo = getGeoLocation()) ? startWatching() : alert('Geolocation not supported.');
}