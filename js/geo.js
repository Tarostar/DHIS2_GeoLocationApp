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
	// This is a test to get current location. This works, but commented out for now.
	//get_location();
	
	// old orgUnit: DiszpKrYNg8
		
	// Test code to check that I could display JSON - this now works
	/*
	var jsonTest = '{ \
			  "program": "eBAyeGv0exc", \
			  "orgUnit": "fdc6uOvgoji", \
			  "eventDate": "2013-10-10", \
			  "status": "COMPLETED", \
			  "storedBy": "admin", \
			  "coordinate": { \
				"latitude": "10", \
				"longitude": "10" \
			  }, \
			  "dataValues": [ \
			    { "dataElement": "qrur9Dvnyt5", "value": "99" }, \
			    { "dataElement": "oZg33kd9taw", "value": "Male" }, \
			    { "dataElement": "msodh3rEMJa", "value": "2013-11-11" } \
			  ] \
			}';
	
	
	$.ajax({
		type:	'post',
		url:	'/demo/api/events/',
		data: jsonTest,
		dataType: 'json',
		contentType:'application/json; charset=utf-8',
		success:function(json){
			alert("success");
		},
		error:function(xhr, status, error){
			alert((xhr.responseText));
		}
	});*/
	
	// for now this just tests doing a query on a program and shows the headers in a table
	// note first line is just some metadata names...
	// note2: we can potentially use this to show all the events in a table on the page below the map
	
	// url for DHIS2 demo testing
	var testurl = "http://apps.dhis2.org/demo/api/analytics/events/query/eBAyeGv0exc?startDate=2012-01-01&endDate=2014-10-31&dimension=ou:O6uvpzGd5pu;fdc6uOvgoji&dimension=eMyVanycQSC&dimension=msodh3rEMJa&dimension=K6uUAvq500H&dimension=oZg33kd9taw&dimension=qrur9Dvnyt5";
	$.getJSON(testurl, function(json){ 
		var $table = $("<table></table>");
		
		/*$table.append($('<span class="bold">'));*/
		$table.append($("<tr><td><b>Name</b></td><td><b>Column</b></td><td><b>Type</b></td><td><b>Hidden</b></td><td><b>Meta</b></td></tr>"));
		/*$table.append($("</span>"));*/
		
	    $.each(json.headers, function (i, item) {
	       $table.append($("<tr><td>" + item.name + "</td><td>" + item.column + "</td><td>" + item.type + "</td><td>" + item.hidden + "</td><td>" + item.meta + "</td></tr>"));
	    });
	    
	    $table.append($("<tr><td><b>Org ID</b></td><td><b>Admission</b></td><td><b>Discharge</b></td><td><b>Diagnosis</b></td><td><b>Gender</b></td><td><b>Age</b></td>/tr>"));
	    
	    $.each(json.rows, function (i, item) {
	    	$table.append($("<tr><td>" + item[5] + "</td><td>" + item[6] + "</td><td>" + item[7] + "</td><td>" + item[8] + "</td><td>" + item[9] + "</td><td>" + item[10] + "</td></tr>"));
	    });
	    
	    $("#div-my-table").append($table);
	});
	 
}
