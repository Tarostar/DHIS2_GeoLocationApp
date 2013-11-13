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
		navigator.geolocation.getCurrentPosition(location_found, gotErr, options );
	} else {
		// alert("No native support for GeoLocation");
		document.getElementByID('noLocationSupport').innerHTML = "Geolocation is not supported by your browser.";
	}
}

// Calls this function when you've successfully obtained the location. 
function location_found(position) {	
	/*alert("Found you at latitude " + position.coords.latitude +
	        ", longitude " + position.coords.longitude);*/
	
	createEvent(position.coords.latitude, position.coords.longitude);
	
}

function newEvent(){
	// get location, which in turn will open the form to create a new event
	get_location();
        
}

function createEvent(latitude, longitude){
	
	// TODO: this should open the event form with latitude and longitude
	
	// test code to create a new event
	
	// Admission Date: eMyVanycQSC
	// Discharge Date: msodh3rEMJa
	// Mode of discharge (string): fWIAEtYVEGk
	// Diagnosis (string): K6uUAvq500H
	
	var jsonTest = '{ \
			  "program": "eBAyeGv0exc", \
			  "orgUnit": "DiszpKrYNg8", \
			  "eventDate": "2013-11-11", \
			  "status": "COMPLETED", \
			  "storedBy": "admin", \
			  "coordinate": { \
				"latitude": "10", \
				"longitude": "10" \
			  }, \
			  "dataValues": [ \
			    { "dataElement": "qrur9Dvnyt5", "value": "9" }, \
			    { "dataElement": "oZg33kd9taw", "value": "Female" }, \
			    { "dataElement": "msodh3rEMJa", "value": "2013-11-11" }, \
				{ "dataElement": "eMyVanycQSC", "value": "2013-10-11" }, \
				{ "dataElement": "fWIAEtYVEGk", "value": "Transferred" }, \
				{ "dataElement": "K6uUAvq500H", "value": "A029 Salmonella infection, unspecified" } \
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
	});
}

function retrieve_events(url, program, startDate, endDate, orgUnit1, orgUnit2)
{
	// for now this just tests doing a query on a program and shows the headers in a table
	// note first line is just some metadata names...
	// note2: we can potentially use this to show all the events in a table on the page below the map
	
	var jsonurl = url + program + "?startDate=" + startDate +  "&endDate=" + endDate + "&dimension=ou:"+ orgUnit1 + ";" + orgUnit2 + "8&dimension=eMyVanycQSC&dimension=msodh3rEMJa&dimension=K6uUAvq500H&dimension=oZg33kd9taw&dimension=qrur9Dvnyt5";
	//var jsonurl = "http://apps.dhis2.org/demo/api/analytics/events/query/eBAyeGv0exc?startDate=2012-01-01&endDate=2012-10-31&dimension=ou:O6uvpzGd5pu;fdc6uOvgoji&dimension=oZg33kd9taw&dimension=qrur9Dvnyt5:EQ:18";
	// var jsonurl = "http://apps.dhis2.org/demo/api/analytics/events/query/IpHINAT79UW?stage=A03MvHHogjR&startDate=2012-03-01&endDate=2012-12-31&dimension=ou:O6uvpzGd5pu&dimension=UXz7xuGCEhU:GT:2000";
	
	$.getJSON(jsonurl, function(json){ 
		
		var $table = $("<table></table>");
		
		// metadata
		$table.append($("<tr><td><b>Orgunit: </b></td><td>" + orgUnit1 + "</td><td>" + orgUnit2 + "</td><td></td><td></td></tr>"));
		//$table.append($("<tr><td><b>" + json.metaData.names.ImspTQPwCqd + "</b></td><td><b>" + json.metaData.names.O6uvpzGd5pu + "</b></td><td><b>" + json.metaData.names.YuQRtpLP10I + "</b></td><td><b>" + json.metaData.names.qrur9Dvnyt5 + "</b></td><td><b>-</b></td></tr>"));
		
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
	
	/*var position = new google.maps.LatLng(latitude, longitude);
	
	// TODO: add images to markers (maybe use url to image)
	// var image = 'images/xxx.png';

	var marker = new google.maps.Marker(
    {
          position: position,
          map: map,
          title: "This is my marker. There are many like it, but this one is mine.",
          url: "http://www.vg.n0"
          // icon: image
    });
	
	// event listener for url 
    google.maps.event.addListener(marker, 'click', function() {
        window.location.href = marker.url;	
    });*/

}