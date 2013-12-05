function populateProgramForm(data){
	//$('#programDIV').append($(document.createElement("select")).
	//attr("value",val.href + ".json").text(val.name+"waaw"));
	$.each(data.programs, function(index, val){ //program=programs.json , index = programs elements id,val = the element ,eg:morbidity
		if(val.type == 3){
		
			// value: id / href
			$('#myProgramSelector').append($(document.createElement("option")).//myProgramSelector=dropdown menu of the programs
                        attr("value",val.id + "/" + val.href + ".json").text(val.name));
						//alert(val.href + ".json");
		}
	});
};

function populateDataElementForm(){
var dataElementArray = [];
	$('#myProgramSelector').change(function(){
		var programValue = $('#myProgramSelector').val();
		// we know id is first part of value so extract second half
		var n = programValue.indexOf("/");
		if (n != -1) {
			selectedProgramURL = programValue.substring(n + 1);
			
			if (Modernizr.localstorage) {
				localStorage["programID"] = programValue.substring(0, n);
			} else {
				// TODO: consider alternatives that do not rely on local storage
				// no native support for HTML5 storage :(
				// maybe try dojox.storage or a third-party solution
				alert("local storage not supported, this app requires HTML5 localStorage support");
			}
	    }
		else
		{
			// TODO: better error handling
				alert("this should never happen, code broken!");
		}
		
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

						if (dataElementType.optionSet != null)
						{
						
							var optionSetUrl = dataElementType.optionSet.href + ".json";
							
							
							var optionSetArray = [];
							$.getJSON(optionSetUrl, function(dataoption){
								$.each(dataoption.options, function(index1, val1){
								
									optionSetArray.push(val1);
									
								}); 
																	
								elementWithType["options"] = optionSetArray;
								console.log(elementWithType);
								
								dataElementArray.push(elementWithType);
								if(dataElementArray.length == dataElement.programStageDataElements.length)
								{
									createForm(dataElementArray);
									
								}	 
						
							});
						} 
						else {
							dataElementArray.push(elementWithType);
							if(dataElementArray.length == dataElement.programStageDataElements.length)
							{
								createForm(dataElementArray);
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
/*

//function saveProgramData() { }

//function deleteProgramData() {}


/function getProgramData() {
	$.getJSON("/assignment2-gui/api/student.json", function(json){	
		populateStudentTable(json);
		populateStudentLocationForm(json);
		});
//	$.get('/assignment2-gui/api/student', populateStudentTable);
//	$.get('/assignment2-gui/api/student', populateStudentLocationForm);
};
function populateStudentTable(json) {

	$('#studentTable').empty();

	for (var s = 0; s < json.length; s++) {
		var student = json[s];
		student = explodeJSON(student);
		var tableString = "<tr>";
		console.log('Student');
		console.log(student);
		// Name
		tableString += "<td>" + student.name + "</td>";

		// Courses
		tableString += "<td>";
		for (var c = 0; c < student.courses.length; c++) {
			var course = student.courses[c];
			course = explodeJSON(course);
			tableString += course.courseCode + ' ';

		}
		tableString += '</td>';

		// Location
		if (student.latitude != null && student.latitude > 0
				&& student.longitude != null && student.longitude > 0) {
			tableString += '<td>' + student.latitude + ' ' + student.longitude
					+ '</td>';
			
			//Adding markers
            var myLatlng = new google.maps.LatLng(student.latitude, student.longitude);                        
            var marker = new google.maps.Marker({
                  position: myLatlng,
                  map: map,
                  title: student.name
              });
		} else {
			tableString += '<td>No location</td>';
		}

		tableString += '</tr>';
		$('#studentTable').append(tableString);
	}
};

;bhvccv noidelk2
*/

function getPrograms(){

		//$.post("http://localhost:8080/dhis-web-commons/security/login.action",{j_username:"admin", j_password:"district"});
	  $.getJSON(dhisAPI + "/api/programs.json", function(json) {
		populateProgramForm(json);
                        
		});
	
};



function createForm(anArray){
	  //var json = [{"name":"Age", "type":"int"}, {"name":"Gender", "type":"string", "options":["Male","Female","N/A"]}]; //, "type":"int"},{"name":"gender", "type":"string"}]';

	  $.each(anArray, function(i, v){
		  var name = v.name;
		  var type = v.type;
		  
		  var htmltext = '<div class="form-group">';
		  htmltext += '<label for="input"' + name + ' class="col-sm-2 control-label">' + name + '</label>';
		  htmltext += '<div class="col-sm-4">';
		
			//TODO: find a way to check if the key options exist in the json v or not
 		  if (v.options != undefined)
		  {
				htmltext += '<select onChange>';				 
				 
				$.each(v.options, function(j, w){
					htmltext += '<option value="' + w + '">' + w + '</option>';
					
				});
				 htmltext += '</select>';
		  } 
		  

		   else
		   {
				htmltext += '<input type="' + type + '" class="form-control" id="input' + name + '" placeholder="' + name + '">';
			}
		  
		  htmltext += '</div>';
		  htmltext += '</div>';
		  htmltext += '<button type="button" save> </button>'; 
		  $('#myForm').append(htmltext);
		 
	  });

};
