var map;
var options = {enableHighAccuracy: true, timeout: 5000, maximumAge: 0 };

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

                        var pos = new google.maps.LatLng(position.coords.latitude,

                                        position.coords.longitude);

                        map.setCenter(pos);
                        
                        
                        // alert(position.coords.latitude + " / " + position.coords.longitude);
                       /* var marker = new google.maps.Marker(
                        	    {
                        	          position: position,
                        	          map: map,
                        	          title: title,
                        	          url: url
                        	          // icon: image
                        	    });
                        		
                        		// event listener for url 
                        	    google.maps.event.addListener(marker, 'click', function() {
                        	        window.location.href = marker.url;	
                        	    });*/

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

function retrieve_events(url, program, startDate, endDate, orgUnit)
{
	// Format of url: http://apps.dhis2.org/demo/api/events?orgUnit=A&program=B&startDate=2000-01-01&endDate=2013-01-01
	// For example:	http://apps.dhis2.org/demo/api/events.json?orgUnit=DiszpKrYNg8&program=eBAyeGv0exc&startDate=2000-01-01&endDate=2013-01-01
			
	// for now this just tests doing a query on a program and shows the headers in a table
	// note first line is just some metadata names...
	// note2: we can potentially use this to show all the events in a table on the page below the map
	
	var jsonurl = url + "?orgUnit=" + orgUnit + "&program=" + program + "&startDate=" + startDate +  "&endDate=" + endDate;
	// old dimensions used - defunct but kept in case will be useful:  + "&dimension=eMyVanycQSC&dimension=msodh3rEMJa&dimension=K6uUAvq500H&dimension=oZg33kd9taw&dimension=qrur9Dvnyt5
	
	$.getJSON(jsonurl, function(json){ 
		
	console.log("JSON "+JSON.stringify(json));
		var $table = $("<table></table>");
		
		// metadata
		$table.append($("<tr><td><b>Orgunit: </b></td><td>" + orgUnit + "</td><td><b>Program: </b></td><td>" + program + "</td><td></td></tr>"));
		
		// header
		$table.append($("<tr><td><b>Value</b></td><td><b>dataElement</b></td><td><b>providedElsewhere</b></td><td><b>storedBy</b></td><td><b>eventData</b></td></tr>"));
		
		// loop through all events and show values
	    $.each(json.eventList, function (i, item) {
	    	 $.each(item.dataValues, function (i, values) {
	    		 $table.append($("<tr><td>" + values.value + "</td><td>" + values.dataElement + "</td><td>" + values.providedElsewhere + "</td><td>" + values.storedBy + "</td><td>" + item.eventDate + "</td></tr>"));
	    		 
	    		 // set markers on map
	    		 //placeMarker(values.value, "http://www.vg.no", Math.floor((Math.random()*100)), Math.floor((Math.random()*100))); 
	    	 });	       
	    });	    
	        
	    $("#div-my-table").append($table);
	});
	
	var markers = [
	               ['London Eye, London', 59,10],
	               ['Palace of Westminster, London', 60,10]
	               ['Test, London', 59,11]
	           ];
	
	placeMarkers(markers);
}

function placeMarkers(markers)
{
	//alert(title + " : "+ latitude + " / " + longitude);
	
	// TODO: add images to markers (maybe use url to image)
	// var image = 'images/xxx.png';

	/*var myLatlng = new google.maps.LatLng(lat, long);                      

    var marker = new google.maps.Marker(
    {
          position: myLatlng,
          map: map,
          title: title
    });*/
	
	var bounds = new google.maps.LatLngBounds();
    
	// Multiple Markers
    markers = [
        ['Stavern Kro', 59,10],
        ['Hvaler Lighthouse', 60,10],
        ['Lake House', 59,11]
    ];
    
 // Info Window Content
    var infoWindowContent = [
        ['<div class="info_content">' +
        '<h3><a href="http://www.uio.no">Stavern Kro</a></h3>' +
        '<p>Food poisoning</p>' +        '</div>'],
        ['<div class="info_content">' +
        '<h3><a href="http://www.uio.no">Hvaler Lighthouse</a></h3>' +
        '<p>Man fell</p>' + '</div>'],
        ['<div class="info_content">' +
         '<h3><a href="http://www.vg.no">Lake House</a></h3>' +
         '<p>Drowned</p>' +        '</div>']
    ];
    
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