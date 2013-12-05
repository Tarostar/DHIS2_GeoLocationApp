var manifestData;
var dhisAPI;
function loadmanifest(){
	$.getJSON('manifest.webapp').done(function(data){
		manifestData = data;
		dhisAPI = manifestData.activities.dhis.href;
	});
}
var dataElementArray1 = [];
function populateProgramForm(data){
	//$('#programDIV').append($(document.createElement("select")).
	//attr("value",val.href + ".json").text(val.name+"waaw"));
	$.each(data.programs, function(index, val){
		if(val.type == 3){
		
			// value: id / href
			$('#myProgramSelector').append($(document.createElement("option")).
                        attr("value",val.id).text(val.name));
						//alert(val.href + ".json");
		}
	});
};
function populateOrgUnit(selectedProgramURL){
	
	$.getJSON(selectedProgramURL, function(json){
		
		//JSON.sort(json.organisationUnits);
		// loop through all events
		sortJson(json.organisationUnits, "name");
	    $.each(json.organisationUnits, function (i, orgUnit) {
	    	$('#selOrgUnit').append($(document.createElement("option")).attr("value", orgUnit.id).text(orgUnit.name));
	    });	
	});
	    
	// change handler - will store orgUnit ID to localStorage
    $('#selOrgUnit').change(function(){
			
		if (Modernizr.localstorage) {
			localStorage["orgUnitID"] = $('#selOrgUnit').val();
		} else {
			// TODO: consider alternatives that do not rely on local storage
			// no native support for HTML5 storage :(
			// maybe try dojox.storage or a third-party solution
			alert("local storage not supported, this app requires HTML5 localStorage support");
		}
    });	    
};

var values = [];
function populateDataElementForm(){
var dataElementArray = [];
	$('#myProgramSelector').change(function(){
		var programValue = $('#myProgramSelector').val();
		// we know id is first part of value so extract second half
//		var n = programValue.indexOf("/");
//		if (n != -1) {
			selectedProgramURL = dhisAPI + "/api/programs/" + programValue + ".json";//.substring(n + 1);
			
			if (Modernizr.localstorage) {
				localStorage["programID"] = programValue;//.substring(0, n);
			} else {
				// TODO: consider alternatives that do not rely on local storage
				// no native support for HTML5 storage :(
				// maybe try dojox.storage or a third-party solution
				alert("local storage not supported, this app requires HTML5 localStorage support");
			}
	    //}
/* 		else
		{
			// TODO: better error handling
				alert("this should never happen, code broken!");
		} */
		
		// load orgUnits for this program
		populateOrgUnit(selectedProgramURL);
		
		//alert('"'+selectedProgramURL+'"');
		$.getJSON(selectedProgramURL, function(dataElementURL){
			var programStageURL = dataElementURL.programStages[0].href + ".json";//dataElement.programStages.href;
			//console.log(dataElementURL);
				//alert(programStageURL);
			$.getJSON(programStageURL, function(dataElement){
				$.each(dataElement.programStageDataElements, function(index, val){
					var typeURL = dhisAPI + "/api/dataElements/" + val.dataElement.id + ".json";
					var type = "";
					$.getJSON(typeURL, function(dataElementType){
						var elementWithType = {};
						elementWithType["name"] = val.dataElement.name;
						elementWithType["type"] = dataElementType.type;
						elementWithType["id"] = dataElementType.id;
												

						if (dataElementType.optionSet != null)
						{
						
							var optionSetUrl = dataElementType.optionSet.href + ".json";
							
							
							var optionSetArray = [];
							$.getJSON(optionSetUrl, function(dataoption){
								$.each(dataoption.options, function(index1, val1){
								
									optionSetArray.push(val1);
									
								}); 
																	
								elementWithType["options"] = optionSetArray;
								
								dataElementArray.push(elementWithType);
								if(dataElementArray.length == dataElement.programStageDataElements.length)
								{
									//createForm(dataElementArray);
									dataElementArray1 = dataElementArray;
									
								}	 
						
							});
						} 
						else {
							dataElementArray.push(elementWithType);
							if(dataElementArray.length == dataElement.programStageDataElements.length)
							{
								//createForm(dataElementArray);
								dataElementArray1 = dataElementArray;
							}	 							
						}
                    							
						
								
					});
					
					
					
				});

			});		

		});
		
	});
};


function getCreateForm(){
	//alert(
};


function getPrograms(){

		//$.post("http://localhost:8080/dhis-web-commons/security/login.action",{j_username:"admin", j_password:"district"});
	  $.getJSON(dhisAPI + "/api/programs.json", function(json) {
		populateProgramForm(json);
                        
		});
	
};


function createForm(anArray){
values = anArray;
	  //var json = [{"name":"Age", "type":"int", "id":"gsddkflh"}, {"name":"Gender", "type":"string", "options":["Male","Female","N/A"]}]; //, "type":"int"},{"name":"gender", "type":"string"}]';
/* var htmltext += '<p ' + '>'+ '< label for ="latitude"' +'> ' +'Latitude '+'</'+'label>'+
    	'<input type="number" name="latitude" id="latitude" value=0>'+
    	'<label for="longitude">Longitude</label>' +
    	'<input type="number" name="longitude" id="longitude" value=0>'+
    	 +
    	'</p> '
		/* htmltext+= '<a href="#myForm">Click to go to the form</a>' + '<a id="myForm"></a>' 
		var locCoor = '<div ' + '>'+ '< label for ="latitude"' +'> ' +'Latitude '+'</'+'label>'+
    	'<input type="number" name="latitude" id="latitude" value=0>'+
    	'<label for="longitude">Longitude</label>' +
    	'<input type="number" name="longitude" id="longitude" value=0>'+
    	 + 	'</div> ';
		  $('#myLoc').append(locCoor); */
		 
	  $('#myForm').empty();
	  
	      			var initHtml = '<input type="text" id="eventdate" value="2013-11-5" />';/* '<div class="form-group">'
				+ '<label for="eventdate" class="col-sm-2 control-label">Event date</label>'
				+	'<div class="col-sm-4">'
				+		'<input type="text" class="form-control" id="eventdate">'
				+	'</div>'
			+ '</div>';	 */
		  
		  $('#myForm').append(initHtml);
	  	  
		  $.each(anArray, function(i, v){
		  var name = v.name;
		  var type = v.type;
		  var id =v.id;
		  
	  
		  var htmltext = '<div class="form-group">';
		  htmltext += '<label for="input"' + name + ' class="col-sm-2 control-label">' + name + '</label>';
		  
		  htmltext += '<div class="col-sm-4">';
		
			//TODO: find a way to check if the key options exist in the json v or not
 		  if (v.options != undefined)
		  {
				htmltext += '<select id="' + id + '" onChange>';				 
				 
				$.each(v.options, function(j, w){
					htmltext += '<option value="' + w + '">' + w + '</option>';
					
				});
				 htmltext += '</select>';
		  } 
		  

		   else
		   {
				htmltext += '<input type="' + type +'" class="form-control" id="' + id + '" placeholder="' + name + '">';
			}
		  
		  htmltext += '</div>';
		  htmltext += '</div>';
		  
		  $('#myForm').append(htmltext);
	  });
		 $('#myForm').append('<input id="savebtn" class="btn btn-primary" type="button" value="Save" onclick="saveEventData()">');
		     

};



		


function saveEventData(){

var json = {};

			  json["program"]= $('#myProgramSelector').val();
			  json["orgUnit"]= $('#selOrgUnit').val();
			  json["eventDate"]= $('#eventdate').val();
			  json["status"]= "COMPLETED";
			  json["storedBy"]= "admin";
				item = {};
				item ["latitude"] = $('#latitude').val();
				item ["longitude"] = $('#longitude').val();
			  json["coordinate"] = item;

	json.dataValues = [];
	
	$.each(values, function(i, v){
		 		       var id = v.id;						
			item = {};
            item ["dataElement"] = id
            item ["value"] = $('#' + id).val();
            json.dataValues.push(item);
		});
	console.log(JSON.stringify(json));		   
		createEvent(json);
	  
}
function addCoordinates () {
createForm(dataElementArray1),
setLocation();
}

