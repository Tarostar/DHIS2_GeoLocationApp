
<body>
<select> id= "selector" </select>


<h1>Single Event Without Registration</h1>

<p>we need to visualize our records location</p>
<p> please select the form you would like to know its location </p>
    
<select>
  <option value="morbidity">Morbidity</option>
  <option value="car_accident">Car Accident</option>
  <option value="mercedes">Mercedes</option>
  <option value="audi">Audi</option>
</select>

    <select id= "selector" onchange > </select>

    
<script>

window.onload = function test() {
    var JSON = {
        "COLUMNS":["ID", "Name"],
        "DATA": [ 
            ["1","Joe"],
            ["2", "Sam"],
            ["3", "Doug"]
        ]
    }, select = document.getElementById("selector");
   
for (var i = 0; i < JSON.DATA.length; i++)  {  
    //for (var i = 0, at = JSON.DATA[i], id = at[0], name = at[1]; i < //JSON.DATA.length; i++) {
    var id=JSON.DATA[i][0];
    var name=JSON.DATA[i][1];
   
    // document.write("Name: " + name)
    //document.write(i);
    
        var option = document.createElement("option");
        option.value = id;
        option.textContent = name;
        select.appendChild(option);
    
    };
};

</script> 



</body>