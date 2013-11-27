function populateProgramForm(data){
	//$('#programDIV').append($(document.createElement("select")).
	//attr("value",val.href + ".json").text(val.name));
	$.each(data.programs, function(index, val){
		if(val.type == 3){
		
			// value: id / href
			$('#myProgramSelector').append($(document.createElement("option")).
                        attr("value",val.id + "/" + val.href + ".json").text(val.name));
						//alert(val.href + ".json");
		}
	});
};
var dataElementArray = [];
function populateDataElementForm(){
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
/* 						if (dataElementType.optionSet != null)
						{
						
							var optionSetUrl = dataElementType.optionSet.href + ".json";//
							
							var optionSetArray = [];
							$.getJSON(optionSetUrl, function(dataoption){
/* 								$.each(dataoption.options, function(index, val){
								//alert(val);
									optionSetArray.push(val);
								}); */
								/*var str = dataoption.options;
						elementWithType["options"] = str.split(',');
						alert(elementWithType["options"] );
							});

								

						} */
						
						//alert(elementWithType);
						dataElementArray.push(elementWithType);
						//console.log(index +' '+ dataElement.programStageDataElements.length);
						if(index == (dataElement.programStageDataElements.length - 1))
						{
							console.log(dataElementArray);
						//document.write("hellooooo");
							createForm(dataElementArray);
						}		//console.log(dataElementType);
								//alert(val.dataElement.name + ": " + dataElementType.type);
								
								
					});
					
				});
				//alert(dataElementArray[0]);
				//createForm(dataElementArray);
			});		

		});
		//createForm(dataElementArray);
	});
};

function getCreateForm(){
	//alert(
};
		/*$('#myProgramSelector').change(function(){
alert("hi");
//document.write("ggfgfg"+ $("#myProgramSelector").val() +"gfgfg");

	var selectedProgramURL = $('#myProgramSelector').val();
	alert(selectedProgramURL);
	$.getJSON(selectedProgramURL, function(dataElement){
		var programStageURL = dataElement.programStages.href;
			alert(programStageURL);
	});*/



function getPrograms(){

		//$.post("http://localhost:8080/dhis-web-commons/security/login.action",{j_username:"admin", j_password:"district"});
	  $.getJSON(dhisAPI + "/api/programs.json", function(json) {
		populateProgramForm(json);
                        
		});
	
};



/*$(document).ready(function() {
	$.post("http://apps.dhis2.org/demo/dhis-web-commons/security/login.action",{j_username:"admin", j_password:"district"});
    alert("hi");
    $.getJSON("http://apps.dhis2.org/demo/api/dataDictionaries.json", function(data) {
    // Get the element with id summary and set the inner text to the result.
    	var obj = data.cookie_status;
       alert(obj);
    $('#myForm').append(obj.[0]);
});
});*/

function createForm(dataElementArray){//(dataElementsArray){
	  //var json = [{"name":"Age", "type":"int"}, {"name":"Gender", "type":"string", "options":["Male","Female","N/A"]}]; //, "type":"int"},{"name":"gender", "type":"string"}]';
	  for (var i = 0; i < dataElementArray.length; i++) {
	   //for (var j = 0; j < dataElementArray.length; j++)
	  
		  var name = dataElementArray[i].name;
		 // alert( dataElementArray[i].name);
		  var type = dataElementArray[i].type;
		  		  //alert( dataElementArray[i].options);

/* 		  var option_menu = new Array();
 		  if (dataElementArray[i].length = 3)
		  {
		  
				 option_menu  = dataElementArray[i].options;
				 alert( dataElementArray[i].options);
				for (i=0; i<= option_menu.length; i++)
				alert(option_menu[i]);
		  } */
		  
		  
		  var htmltext = '<div class="form-group">';
		  htmltext += '<label for="input"' + name + ' class="col-sm-2 control-label">' + name + '</label>';
		  htmltext += '<div class="col-sm-4">';
 		 /* if(options.length != 0)
		  {  
		  htmltext += '<select onChange>';
		  $.each(options, function( val){
				htmltext += '  <option value="def" >' + options.val +'</option>';
		  });
		  htmltext += '</select>';
		   }else{  */
					  htmltext += '<input type="' + type + '" class="form-control" id="input' + name + '" placeholder="' + name + '">';

		  //}
		  
		  htmltext += '</div>';
		  htmltext += '</div>';
/*		  $('#myForm').append("<div class=\"form-group\">");
		  $('#myForm').append("<label for=\"input" + name + "\" class=\"col-sm-2 control-label\">" + name + "</label>");
		  $('#myForm').append("<div class=\"col-sm-4\">");
		  $('#myForm').append("<input type=\"" + json[i].type + "\" class=\"form-control\" id=\"input" + name + " placeholder=\"" + name + ">");
	      $('#myForm').append("</div>");
		  $('#myForm').append("</div>");
	*/
	alert(htmltext);
		  $('#myForm').append(htmltext);
	  };

};

