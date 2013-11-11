
$(document).ready(function() {
	  var json = [{"name":"Age", "type":"int"}, {"name":"Gender", "type":"string"}]; //, "type":"int"},{"name":"gender", "type":"string"}]';
	  for (var i = 0; i < json.length; i++) {
		  var name = json[i].name;
		  var type = json[i].type;
		  var htmltext = "<div class=\"form-group\">";
		  htmltext += "<label for=\"input" + name + "\" class=\"col-sm-2 control-label\">" + name + "</label>";
		  htmltext += "<div class=\"col-sm-4\">";
		  htmltext += "<input type=\"" + type + "\" class=\"form-control\" id=\"input" + name + "\" placeholder=\"" + name + "\">";
		  htmltext += "</div>";
		  htmltext += "</div>";
/*		  $('#myForm').append("<div class=\"form-group\">");
		  $('#myForm').append("<label for=\"input" + name + "\" class=\"col-sm-2 control-label\">" + name + "</label>");
		  $('#myForm').append("<div class=\"col-sm-4\">");
		  $('#myForm').append("<input type=\"" + json[i].type + "\" class=\"form-control\" id=\"input" + name + " placeholder=\"" + name + ">");
	      $('#myForm').append("</div>");
		  $('#myForm').append("</div>");
	*/
		  $('#myForm').append(htmltext);
	  };
	});
