var map;
var options = {enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };

var markers = [];
var infoWindowContent = [];

var bRetrievedEvents = false;

function initialize_map() {

		var mapOptions = {
	          center: new google.maps.LatLng(0, 0),
	          zoom: 8,
	          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

		map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

        // Try HTML5 geolocation


        if (navigator.geolocation) {

                navigator.geolocation.getCurrentPosition(function(position) {
                		// center map
                        var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                        map.setCenter(pos);
                     
                        // set latitude and longitude fields
                        document.getElementById("latitude").value = position.coords.latitude;
                    	document.getElementById("longitude").value = position.coords.longitude;
                      
                }, function() {

                        handleNoGeolocation(true);

                });

        } else {

                // Browser doesn't support Geolocation
                // Should really tell the user…

        }
        
        // function to get google coordinates and put them in the long/lat fields
        google.maps.event.addListener(map, "rightclick", function(event) {     	
        	document.getElementById("latitude").value = event.latLng.lat();
        	document.getElementById("longitude").value = event.latLng.lng();
        });
        
        // place markers when idle, but only if new events have been retrieved
        google.maps.event.addListener(map, "idle", function(event) { 
        	if (bRetrievedEvents == true) {
        		placeMarkers();
        	}
        });
        
        
		
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
	// set latitude and longitude fields
    document.getElementById("latitude").value = position.coords.latitude;
	document.getElementById("longitude").value = position.coords.longitude;	
}

function newEvent(){
	// get position from fields		
	// createEvent(document.getElementById("latitude").value, var longfield = document.getElementById("longitude").value);
	alert("create event at " + document.getElementById("latitude").value + " / " + document.getElementById("longitude").value)
}

function setLocation(){
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

// TODO: this should be invoked by user for a specific program (potentially also filter for location area)
function retrieve_events(url, program, startDate, endDate, orgUnit)
{
	// Format of url: http://apps.dhis2.org/demo/api/events?orgUnit=A&program=B&startDate=2000-01-01&endDate=2013-01-01
	// For example:	http://apps.dhis2.org/demo/api/events.json?orgUnit=DiszpKrYNg8&program=eBAyeGv0exc&startDate=2013-01-01&endDate=2013-01-01
	
	// http://apps.dhis2.org/demo/api/events?orgUnit=DiszpKrYNg8&program=p4soZg51loO&startDate=2013-06-01&endDate=2013-12-12
			
	// for now this just tests doing a query on a program and shows the headers in a table
	// note first line is just some metadata names...
	// note2: we can potentially use this to show all the events in a table on the page below the map
	
	var jsonurl = url + "?orgUnit=" + orgUnit + "&program=" + program + "&startDate=" + startDate +  "&endDate=" + endDate;
	// old dimensions used - defunct but kept in case will be useful:  + "&dimension=eMyVanycQSC&dimension=msodh3rEMJa&dimension=K6uUAvq500H&dimension=oZg33kd9taw&dimension=qrur9Dvnyt5
	
	
	
	$.getJSON(jsonurl, function(json){ 
		
		// TODO: test output, remove in final version
		console.log("JSON "+JSON.stringify(json));
		
		var $table = $("<table></table>");
		
		// metadata
		$table.append($("<tr><td><b>Orgunit: </b></td><td>" + orgUnit + "</td><td><b>Program: </b></td><td>" + program + "</td><td></td></tr>"));
		
		// header
		$table.append($("<tr><td><b>Value</b></td><td><b>dataElement</b></td><td><b>providedElsewhere</b></td><td><b>storedBy</b></td><td><b>eventData</b></td></tr>"));

		// TODO:how do we get to these....  item.coordinate.latitude / item.coordinate.longitude
		// attempting to use them produces javascript error
		
		// loop through all events and show values
	    $.each(json.eventList, function (i, item) {
	    	 $.each(item.dataValues, function (i, values) {
	    		 $table.append($("<tr><td>" + values.value + "</td><td>" + values.dataElement + "</td><td>" + values.providedElsewhere + "</td><td>" + values.storedBy + "</td><td>" + item.eventDate + "</td></tr>"));
	    		 
	    		 // add map marker
	    		 markers.push([values.value, Math.floor((Math.random()*40)+20), Math.floor((Math.random()*15))]);
	    		 infoWindowContent.push( ['<div class="info_content">' +
	    		                          '<h3><a href="' + item.href + '">' + item.href + '</a></h3>' +
	    		                          '<p>Food poisoning</p>' +        '</div>']);
	    	 });	       
	    });	    
	        
	    $("#div-my-table").append($table);
	    
	    // flag to track when to update markers
	    bRetrievedEvents = true;
	});
}

function placeMarkers()
{
	// we only place markers if we actually got some new event (this is because markers are at the moment set when google map goes idle and this flag is true)
	bRetrievedEvents = false;
	
	// TODO: add images to markers (maybe use url to image)
	// var image = 'images/xxx.png';
	
	var bounds = new google.maps.LatLngBounds();
    
    // Display multiple markers on a map
    var infoWindow = new google.maps.InfoWindow(), marker, i;

    // Loop through our array of markers & place each one on the map  
    for( i = 0; i < markers.length; i++ ) {
        var position = new google.maps.LatLng(markers[i][1], markers[i][2]);
        bounds.extend(position);
        marker = new google.maps.Marker({
            position: position,
            map: map,
            title: markers[i][0],
        });
        
        // Allow each marker to have an info window    
        google.maps.event.addListener(marker, 'click', (function(marker, i) {
            return function() {
                infoWindow.setContent(infoWindowContent[i][0]);
                infoWindow.open(map, marker);
            }
        })(marker, i));

        // Automatically center the map fitting all markers on the screen
        
        map.fitBounds(bounds);
    }

    // Override our map zoom level once our fitBounds function runs (Make sure it only runs once)
    /*var boundsListener = google.maps.event.addListener((map), 'bounds_changed', function(event) {
        this.setZoom(8);
        google.maps.event.removeListener(boundsListener);
    });*/
}