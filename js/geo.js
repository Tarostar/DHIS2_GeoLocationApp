// map and related options and markers
var map;
var options = {enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };
var markers = [];
var infoWindowContent = [];

// TODO: temporary to set to true whenever we retrieve events to update markers
var bRetrievedEvents = false;

function initialize_map() {

		var mapOptions = {
	          center: new google.maps.LatLng(0, 0),
	          zoom: 8,
	          mapTypeId: google.maps.MapTypeId.ROADMAP
        };

		map = new google.maps.Map(document.getElementById("map-canvas"), mapOptions);

		//get current position to set user's location
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

                // Browser doesn't support Geolocation, so simply set latitude and longitude to zero (user can select location by right-clicking map or typing manually)
	            document.getElementById("latitude").value = 0;
	        	document.getElementById("longitude").value = 0;

        }
        
        // function to get google coordinates and put them in the long/lat fields
        google.maps.event.addListener(map, "rightclick", function(event) {     	
        	document.getElementById("latitude").value = event.latLng.lat();
        	document.getElementById("longitude").value = event.latLng.lng();
        });
        
        // place markers when idle, but only if new events have been retrieved
        google.maps.event.addListener(map, "idle", function(event) {
        	if (bRetrievedEvents == true) {
        		// add map marker
        		placeMarkers();
        	}
        });
        
        
		
}

function handleNoGeolocation(boolFlag)
{
	document.getElementById("latitude").value = 0;
	document.getElementById("longitude").value = 0;
}

// trap a GPS error, log it to console and display on site
function gotErr(error) {
    var errors = { 
            1: 'Permission denied',
            2: 'Position unavailable',
            3: 'Request timeout'
        };
    console.log("Error: " + errors[error.code]);
    $('#debug-latlng').text('GPS position not available');
    alert("Error: " + errors[error.code])
}

// helper function to get location
function get_location() {
	if (Modernizr.geolocation) {
		navigator.geolocation.getCurrentPosition(location_found, gotErr, options );
	} else {
		alert("No native support for GeoLocation");
		// document.getElementByID('noLocationSupport').innerHTML = "Geolocation is not supported by your browser.";
	}
}

// calls this function when you've successfully obtained the location. 
function location_found(position) {	
	// set latitude and longitude fields
    document.getElementById("latitude").value = position.coords.latitude;
	document.getElementById("longitude").value = position.coords.longitude;	
}

function newEvent(){
	// get position from fields		
	createEvent(document.getElementById("latitude").value, document.getElementById("longitude").value);
	// alert("created event at " + document.getElementById("latitude").value + " / " + document.getElementById("longitude").value)
}

function setLocation(){
	get_location();
}

function showEvents(){
	var fromDate = $('#fromdate').datepicker().val();
	var toDate = $('#todate').datepicker().val();
	retrieve_events(dhisAPI + "/api/events.json", document.getElementById("program").value, fromDate, toDate, document.getElementById("orgunit").value);
}

function createEvent(latitude, longitude){
	
	// TODO: this should open the event form with latitude and longitude
	
	// test code to create a new event that can be used to save events from form
	
	// Admission Date: eMyVanycQSC
	// Discharge Date: msodh3rEMJa
	// Mode of discharge (string): fWIAEtYVEGk
	// Diagnosis (string): K6uUAvq500H
	
	var program = "eBAyeGv0exc";
	
	var jsonTest = '{ \
			  "program": "' + program + '", \
			  "orgUnit": "DiszpKrYNg8", \
			  "eventDate": "2013-11-20", \
			  "status": "COMPLETED", \
			  "storedBy": "admin", \
			  "coordinate": { \
				"latitude": "' + latitude + '", \
				"longitude": "' + longitude + '" \
			  }, \
			  "dataValues": [ \
			    { "dataElement": "qrur9Dvnyt5", "value": "19" }, \
			    { "dataElement": "oZg33kd9taw", "value": "Female" }, \
			    { "dataElement": "msodh3rEMJa", "value": "2013-11-21" }, \
				{ "dataElement": "eMyVanycQSC", "value": "2013-11-11" }, \
				{ "dataElement": "fWIAEtYVEGk", "value": "Transferred" }, \
				{ "dataElement": "K6uUAvq500H", "value": "A029 Salmonella infection, unspecified" } \
			  ] \
			}';
	
	
	$.ajax({
		type:	'post',
		url:	dhisAPI + '/api/events/',
		data: jsonTest,
		dataType: 'json',
		contentType:'application/json; charset=utf-8',
		success:function(json){
			// on success retrieve all values again (this is a bit rough since it depends on user parameters, but demonstrates the idea). 
			var fromDate = $('#fromdate').datepicker().val();
			var toDate = $('#todate').datepicker().val();
			retrieve_events(dhisAPI + "/api/events.json", document.getElementById("program").value, fromDate, toDate, document.getElementById("orgunit").value);
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
		//console.log("JSON "+JSON.stringify(json));
		
		var $table = $("<table></table>");
		
		// metadata
		$table.append($("<tr><td><b>Orgunit: </b></td><td>" + orgUnit + "</td><td><b>Program: </b></td><td>" + program + "</td><td></td></tr>"));
		
		// header titles
		var title1 = "Field1";
		var title2 = "Field2";
		var title3 = "Field3";
		var title4 = "Field4";
		var title5 = "Field5";
		
		if (program == "eBAyeGv0exc") {
			title1 = "Diagnosis";
			title2 = "Age";
			title3 = "Gender";
			title4 = "Admission";
			title5 = "Discharge";
		}
		
		// set header titles
		$table.append($("<tr><td><b>Lat</b></td><td><b>Long</b></td><td><b>" + title1 + "</b></td><td><b>" + title2 + "</b></td><td><b>" + title3 + "</b></td><td><b>" + title4 + "</b></td><td><b>" + title5 + "</b></td></tr>"));
		
		// loop through all events
	    $.each(json.eventList, function (i, item) {
	    	tableValues = ["0","0","-","-","-","-","-"];  	
	     	
	    	// loop through values for each event (with some special handling)
	    	var nIndex = 2;
	    	 $.each(item.dataValues, function (i, values) {
	    		 if (program == "eBAyeGv0exc") {
	    			 // special case for this program (since it is the only one we really use we might as well do it prettily
		    		 switch (values.dataElement) {
		    		 	case "K6uUAvq500H": // diagnosis
		    		 		tableValues[2] = values.value;
		    		 		break;
		    		 	case "qrur9Dvnyt5": // age
		    		 		tableValues[3] = values.value;
		    		 		break;
		    		 	case "oZg33kd9taw": // gender
		    		 		tableValues[4] = values.value;
		    		 		break;
		    		 	case "eMyVanycQSC": // admission
		    		 		tableValues[5] = values.value; 
		    		 		break;
		    		 	case "msodh3rEMJa": // discharge
		    		 		tableValues[6] = values.value; 
		    		 		break;
		    		 	}
		    	 	}
		    		else {
		    			tableValues[nIndex] = values.value;
		    			nIndex++;
		    		}
	    	 });
	    	 
	    	 // handle events with coordinates
	    	 if (item.coordinate) {
    			tableValues[0] = item.coordinate.latitude;
	    		tableValues[1] = item.coordinate.longitude;
	    		 
    			// this event has coordinates, put down marker
	       		 markers.push([item.event, item.coordinate.latitude, item.coordinate.longitude]);
	       		 infoWindowContent.push( ['<div class="info_content">' +
	       		                          '<h3><a href="' + item.href + '.xml">' + item.href + '</a></h3>' +
	       		                          '<p>Org Unit: ' + item.orgUnit + '</p>' +
	       		                          '<p>Event Date: ' + item.eventDate + '</p>' +
	       		                          '<p>EStored By: ' + item.storedBy + '</p>' +
	       		                          '<p>Program: ' + item.program + '</p>' +
	       		                          '<p>Lat: ' + tableValues[0] + '</p>' +
	       		                          '<p>Long: ' + tableValues[1] + '</p>' +
	       		                          '<p>' + title1 + ': ' + tableValues[2] + '</p>' +
	       		                          '<p>' + title2 + ': ' + tableValues[3] + '</p>' +
	       		                          '<p>' + title3 + ': ' + tableValues[4] + '</p>' +
	       		                          '<p>' + title4 + ': ' + tableValues[5] + '</p>' +
	       		                       	  '<p>' + title5 + ': ' + tableValues[6] + '</p>' +
	       		                          '</div>']);
	    	}
	    	 
	    	 // insert event into table
	    	 $table.append($("<tr><td>" + tableValues[0] + "</td><td>" + tableValues[1] + "</td><td>" + tableValues[2] + "</td><td>" + tableValues[3] + "</td><td>" + tableValues[4] + "</td></tr>"));
	    });	    
	        
	    $("#div-my-table").empty().append($table);
	    
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
            icon: "img/marker.png"
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
