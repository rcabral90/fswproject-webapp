var date = new Date();
var date_compare = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
function get_resident_information(resident_id){
	$.get( "http://127.0.0.1:7177/residents/"+resident_id+"/?format=json", function( data ) {
		//fill dom objects
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

function get_primary_doctor_information(resident_id){
	var doctor_id = 0;
	//get the primary doctor id
	$.get("http://127.0.0.1:7177/?format=json", function(data){
		//set a var
		doctor_id = data.results[0].doctor_id;
	});
	//get the primary doctor information
	$.get("http://127.0.0.1:7177/doctors/"+doctor_id+"/?format=json", function(data){
		//set vars, fill dom's
		var first_name = data.results[0].first_name;
		if((data.results[0].middle_name)){
			var middle_name = data.results[0].middle_name;
		}else{
			var middle_name = "";
		}
		var last_name = data.results[0].last_name;
		var specialization = data.results[0].specialization;
		var phone_number = data.results[0].phone_number;
		$("#doctor_name").append(first_name+" "+middle_name+" "+last_name);
		$("#doctor_specialization").append(specialization);
		$("#doctor_phone_number").append(phone_number);
	});
}

function get_emergency_contact_information(resident_id){
	$.get("http://127.0.0.1:7177/emergencycontacts/"+resident_id+"/?format=json", function(data){
		var first_name = data.results[0].first_name;
		if((data.results[0].middle_name)){
			var middle_name = data.results[0].middle_name;
		}else{
			var middle_name = "";
		}
		var last_name = data.results[0].last_name;
		var phone_number = data.results[0].phone_number;
		var address1 = data.results[0].address1;
		var address2 = data.results[0].address2;
		var city = data.results[0].city;
		//why does emergency contact have no state?
		var state = data.results[0].state;
		if(data.results[0].state){
			var state = data.results[0].state;
		}else{
			var state = "";
		}
		var zip_code = data.results[0].zip_code;
		var relationship = data.results[0].relationship;
		$("#emergency_contact_name").append(first_name+" "+middle_name+" "+last_name);
		$("#emergency_contact_phone_number").append(phone_number);
		$("#emergency_contact_address").append(address1+" "+address2+", "+state+" "+zip_code);
		$("#emergency_contact_relationship").append(relationship);
	});
}

function get_current_medication_information(resident_id){
	$.get("http://127.0.0.1:7177/medication/"+resident_id+"/?format=json", function(data){
		if(data.results.length < 1){
			//do nothing?
		}else{
			$("#medication_current_table").empty();
			//build the table
			$("#medication_current_table").append("<tr><th>Medication Name</th><th>Generic Name</th><th>Expire Date</th><th>Prescribed</th><th>Dose (Mg)</th><th>Frequency</th><th>Purpose</th><th>Note</th></tr>");
			for(i=0;i<data.results.length;i++){
				$("#medication_current_table").append(
					"<tr><td>"+data.results[i].medication_name+
					"</td><td>"+data.results[i].generic_name+
					"</td><td>"+data.results[i].med_exipre+
					"</td><td>"+data.results[i].med_prescribed+
					"</td><td>"+data.results[i].med_dose_mg+
					"</td><td>"+data.results[i].med_freq+
					"</td><td>"+data.results[i].med_purpose+
					"</td><td>"+data.results[i].note+
					"</td></tr>"
				);
			}
		}
	});
}

function get_medication_history(resident_id){
	$.get("http://127.0.0.1:7177/medicationhistory/"+resident_id+"/?format=json", function(data){
		if(data.results.length < 1){
			//do nothing?
		}else{
			//clear the table just in case
			$("#medication_history_table").empty();
			//build the table
			$("#medication_history_table").append("<tr><th>Medication Name</th><th>Generic Name</th><th>Expire Date</th><th>Dose (Mg)</th><th>Frequency</th><th>Diet</th><th>Purpose</th><th>Note</th></tr>");
			for(i=0;i<data.results.length;i++){
				$("#medication_history_table").append(
					"<tr><td>"+data.results[i].med_name+
					"</td><td>"+data.results[i].generic_name+
					"</td><td>"+data.results[i].expiration+
					"</td><td>"+data.results[i].dosages+
					"</td><td>"+data.results[i].frequency+
					"</td><td>"+data.results[i].diets+
					"</td><td>"+data.results[i].purpose+
					"</td><td>"+data.results[i].note+
					"</td></tr>"
				);
			}
		}
	});
}

function get_physical_information(resident_id){
	$.get("http://127.0.0.1:7177/?format=json", function(data){
		var physical_date = data.results[0].physical_date;
		$("#resident_last_physical").append(physical_date);
	});
}

function get_prescription_information(resident_id){
	$.get("http://127.0.0.1:7177/prescription/"+resident_id+"/?format=json", function(data){
		if(data.results.length < 1){
			//do nothing?
		}else{
			$("#prescription_table").empty();
			//build the table
			$("#prescription_table").append("<tr><th>Prescription Name</th><th>Date Ordered</th><th>Date Received</th><th>Refill Date</th><th>Quantity</th></tr>");
			for(i=0;i<data.results.length;i++){
				if(data.results[i].refill_date < date_compare){
					refill_date_danger = "<tr class='danger'>";
					refill_date = "<b>"+data.results[i].refill_date+"</b>";
				}else{
					refill_date_danger = "<tr>";
					refill_date = data.results[i].refill_date;
				}
				$("#prescription_table").append(
					refill_date_danger+"<td>"+data.results[i].prescription_number+
					"</td><td>"+data.results[i].date_ordered+
					"</td><td>"+data.results[i].date_received+
					"</td><td>"+refill_date+
					"</td><td>"+data.results[i].quantity+
					"</td></tr>"
				);
			}
		}
	});
}

function get_hospitalization_history(resident_id){
	$.get("http://127.0.0.1:7177/hospitalization/"+resident_id+"/?format=json", function(data){
		if(data.results.length < 1){
			//do nothing?
		}else{
			$("#hospitalizations_table").empty();
			//build the table
			$("#hospitalizations_table").append("<tr><th>Hospitalization Date</th><th>Location</th><th>Duration</th><th>Reason</th><th>Medication Changes</th><th>Diagnosis</th><th>Notes</th></tr>");
			for(i=0;i<data.results.length;i++){
				$("#hospitalizations_table").append(
					"<tr><td>"+data.results[i].hospitalization_date+
					"</td><td>"+data.results[i].hospitalization_location+
					"</td><td>"+data.results[i].duration_of_stay+
					"</td><td>"+data.results[i].reason+
					"</td><td>"+data.results[i].medication_changes+
					"</td><td>"+data.results[i].diagnosis+
					"</td><td>"+data.results[i].notes+
					"</td></tr>"
				);
			}
		}
	});
}

function get_resident_assessment_information(resident_id){
	$.get("http://127.0.0.1:7177/assessment/"+resident_id+"/?format=json", function(data){
		if(data.results.length < 1){
			//do nothing?
		}else{
			$("#assessment_table").empty();
			//build the table
			$("#assessment_table").append("<tr><th>Assessment Date</th><th>Assessment Time</th><th>Weight</th><th>Blood Pressure</th><th>Notes</th></tr>");
			for(i=0;i<data.results.length;i++){
				$("#assessment_table").append(
					"<tr><td>"+data.results[i].assessment_date+
					"</td><td>"+data.results[i].assessment_time+
					"</td><td>"+data.results[i].weight+
					"</td><td>"+data.results[i].blood_pressure+
					"</td><td>"+data.results[i].assess_notes+
					"</td></tr>"
				);
			}
		}
	});
}

function get_resident_notes_information(resident_id){
	$.get("http://127.0.0.1:7177/notes/"+resident_id+"/?format=json", function(data){
		if(data.results.length < 1){
			//do nothing?
		}else{
			$("#notes_table").empty();
			//build the table
			$("#notes_table").append("<tr><th>Notes</th></tr>");
			for(i=0;i<data.results.length;i++){
				$("#notes_table").append(
					"<tr><td>"+data.results[i].notes+
					"</td></tr>"
				);
			}
		}
	});
}

function get_resident_allergy_information(resident_id){
	$.get("http://127.0.0.1:7177/allergies/"+resident_id+"/?format=json", function(data){
		if(data.results.length < 1){
			//do nothing?
		}else{
			$("#allergies_table").empty();
			//build the table
			$("#allergies_table").append("<tr><th>Name</th><th>Description</th></tr>");
			for(i=0;i<data.results.length;i++){
				$("#allergies_table").append(
					"<tr><td>"+data.results[i].allergy_title+
					"</td><td>"+data.results[i].allergy_description+
					"</td></tr>"
				);
			}
		}
	});
}

function get_resident_diet_information(resident_id){
	$.get("http://127.0.0.1:7177/diets/"+resident_id+"/?format=json", function(data){
		if(data.results.length < 1){
			//do nothing?
		}else{
			$("#diet_table").empty();
			//build the table
			$("#diet_table").append("<tr><th>Name</th><th>Description</th></tr>");
			for(i=0;i<data.results.length;i++){
				$("#diet_table").append(
					"<tr><td>"+data.results[i].diet_title+
					"</td><td>"+data.results[i].diet_description+
					"</td></tr>"
				);
			}
		}
	});
}

function get_resident_emergency_contacts_information(resident_id){
	$.get("http://127.0.0.1:7177/emergencycontacts/"+resident_id+"/?format=json", function(data){
		if(data.results.length < 1){
			//do nothing?
		}else{
			$("#emergency_contacts_table").empty();
			//build the table
			$("#emergency_contacts_table").append("<tr><th>Name</th><th>Address</th><th>Phone Number</th><th>Relationship</th></tr>");
			for(i=0;i<data.results.length;i++){
				if(data.results[i].middle_name){
					var middle_name = data.results[i].middle_name;
				}else{
					var middle_name = "";
				};
				$("#emergency_contacts_table").append(
					"<tr><td>"+data.results[i].first_name+" "+middle_name+" "+data.results[i].last_name+
					"</td><td>"+data.results[i].address1+" "+data.results[i].address2+" "+data.results[i].city+" "+data.results[i].zip_code+
					"</td><td>"+data.results[i].phone_number+
					"</td><td>"+data.results[i].relationship+
					"</td></tr>"
				);
			}
		}
	});
}