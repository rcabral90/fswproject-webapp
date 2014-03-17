function get_resident_information(){
	$.get( "http://127.0.0.1:7177/residents/1/?format=json", function( data ) {
		//fill dom objects
		var resident_id = data.results[0].resident_id;
		var first_name = data.results[0].first_name;
		if((data.results[0].middle_name)){
			var middle_name = data.results[0].middle_name;
		}else{
			var middle_name = "";
		}
	  var last_name = data.results[0].last_name;
	  var address1 = data.results[0].address1;
	  var address2 = data.results[0].address2;
	  var city = data.results[0].city;
	  var state = data.results[0].state;
	  var zip_code = data.results[0].zip_code;
	  var home_phone = data.results[0].home_phone;
	  var cell_phone = data.results[0].cell_phone;
	  var dob = data.results[0].date_of_birth;
	  $("#resident_name").append(first_name+" "+middle_name+" "+last_name);
	  $("#resident_address").append(address1+" "+address2+", "+state+" "+zip_code);
	  $("#resident_home_phone").append(home_phone);
	  $("#resident_cell_phone").append(cell_phone);
	  $("#resident_dob").append(dob);
	});
}

function get_primary_doctor_information(){
	
}