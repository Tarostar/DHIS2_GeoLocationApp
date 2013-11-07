var map;
var options = {enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };

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
    alert("Error: " + errors[error.code])
} //gotErr

//This function gets called when you press the Set Location button
function get_location() {
	if (Modernizr.geolocation) {
		// Find location... fill in.

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
	//get_location();
		
	// Test code to check that I could display JSON
	/*var json =
		 {
			  "program": "eBAyeGv0exc",
			  "orgUnit": "DiszpKrYNg8",
			  "eventDate": "2013-05-17",
			  "status": "COMPLETED",
			  "storedBy": "admin",
			  "coordinate": {
			    "latitude": "59.8",
			    "longitude": "10.9"
			  },
			  "dataValues": [
			    { "dataElement": "qrur9Dvnyt5", "value": "22" },
			    { "dataElement": "oZg33kd9taw", "value": "Male" },
			    { "dataElement": "msodh3rEMJa", "value": "2013-05-18" }
			  ]
			}
	
	
	var $table = $("<table></table>");
    $.each(json.dataValues, function (i, item) {
       $table.append($("<tr><td>" + item.dataElement + "</td><td>" + item.value + "</td></tr>"));
    });
	
   $("#div-my-table").append($table);*/
	
	// TODO: test this
	//$.getJSON("http://apps.dhis2.org/demo/api/events.json", {jsondata}, function(json){ });
	//$.getJSON("http://apps.dhis2.org/demo/api/events.json", jsondata, function(json){ });
		
	$.getJSON("api/analytics/events/query/eBAyeGv0exc?startDate=2012-01-01&endDate=2012-10-31&dimension=ou:O6uvpzGd5pu;fdc6uOvgoji&dimension=oZg33kd9taw&dimension=qrur9Dvnyt5:EQ:18", function(json){ 
		var $table = $("<table></table>");
	    $.each(json.dataValues, function (i, item) {
	       $table.append($("<tr><td>" + item.dataElement + "</td><td>" + item.value + "</td></tr>"));
	    });
	    
	    $("#div-my-table").append($table);
	});
	 
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
