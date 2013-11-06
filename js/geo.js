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
		

		//navigator.geolocation.getCurrentPosition(location_found);
		
		navigator.geolocation.getCurrentPosition(location_found, gotErr, options );
		
		
		
	} else {
		// no native support; maybe try a fallback?		
		document.getElementByID('noLocationSupport').innerHTML = "Geolocation is not supported.";
	}
}

//Call this function when you've succesfully obtained the location. 
function location_found(position) {
	// Extract latitude and longitude and save on the server using an AJAX call. 
	// When you've updated the location, call populateStudentTable(json); again
	// to put the new location next to the student on the page. . 
	
	/*alert("Found you at latitude " + position.coords.latitude +
	        ", longitude " + position.coords.longitude);*/
	
	/*$.getJSON("http://<path here>.json", {
		latitude:position.coords.latitude, longitude:position.coords.longitude
	},function(json){
	   		
		// TODO: open form
	  });*/
	
	
}
