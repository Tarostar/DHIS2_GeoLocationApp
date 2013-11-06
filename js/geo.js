var map;

function initialize_map() {

        var mapOptions = {

                zoom : 10,

                mapTypeId : google.maps.MapTypeId.ROADMAP

        };

        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

        // Try HTML5 geolocation

        if (navigator.geolocation) {

                navigator.geolocation.getCurrentPosition(function(position) {

                        var pos = new google.maps.LatLng(position.coords.latitude,

                                        position.coords.longitude);

                        map.setCenter(pos);

                }, function() {

                        handleNoGeolocation(true);

                });

        } else {

                // Browser doesn't support Geolocation

                // Should really tell the user…

        }
}

function handleNoGeolocation(boolFlag)
{
	// Implement as appropriate
}

//Trap a GPS error, log it to console and display on site
function gotErr(error) {
	alert("got error");
    var errors = { 
            1: 'Permission denied',
            2: 'Position unavailable',
            3: 'Request timeout'
        };
    console.log("Error: " + errors[error.code]);
    $('#debug-latlng').text('GPS position not available');
} //gotErr

//This function gets called when you press the Set Location button
function get_location() {
	if (Modernizr.geolocation) {
		// Find location... fill in.
		alert("modernizr")

		//navigator.geolocation.getCurrentPosition(location_found);
		
		navigator.geolocation.getCurrentPosition(location_found, gotErr, options );
		
	} else {
		alert("no native support");
		// no native support; maybe try a fallback?		
		document.getElementByID('noLocationSupport').innerHTML = "Geolocation is not supported.";
	}
}

// Calls this function when you've successfully obtained the location. 
function location_found(position) {	
	// temporary to show that we get latitude and longitude
	alert("Found you at latitude " + position.coords.latitude +
	        ", longitude " + position.coords.longitude);
	
	/*$.getJSON("http://<path here>.json", {
		latitude:position.coords.latitude, longitude:position.coords.longitude
	},function(json){
	   		
		// TODO: open form?
	  });*/
	
	var myLatlng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);                        

    var marker = new google.maps.Marker(
    {
          position: myLatlng,
          map: map,
          title: "This is my marker. There are many like it, but this one is mine."
    });
	
	
}

function eventClickFunction(){
	get_location();
}
	
// helper to be better able to see JSON data
function explodeJSON(object) {
	if (object instanceof Object == true) {
		objectStorage[object['@id']] = object;
		console.log('Object is object');
	} else {
		console.log('Object is not object');
		object = objectStorage[object];
		console.log(object);
	}
	console.log(object);
	return object;
}
