var backend_url = "http://127.0.0.1:7177";
var date = new Date();
var date_compare = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
function get_resident_information(resident_id){
	$.get(backend_url+"/residents/"+resident_id+"/?format=json", function( data ) {
		//fill dom objects
		var first_name = data[0].first_name;
		if((data[0].middle_name)){
			var middle_name = data[0].middle_name;
		}else{
			var middle_name = "";
		}
		var last_name = data[0].last_name;
		var address1 = data[0].address1;
		var address2 = data[0].address2;
		var city = data[0].city;
		var state = data[0].state;
		var zip_code = data[0].zip_code;
		var home_phone = data[0].home_phone;
		var cell_phone = data[0].cell_phone;
		var dob = data[0].date_of_birth;
		$("#resident_name").append(first_name+" "+middle_name+" "+last_name);
		$("#resident_address").append(address1+" "+address2+", "+state+" "+zip_code);
		$("#resident_home_phone").append(home_phone);
		$("#resident_cell_phone").append(cell_phone);
		$("#resident_dob").append(dob);
	});
}

function get_primary_doctor_information(resident_id){
	//get the primary doctor id
	$.get(backend_url+"/residentstodoctor/"+resident_id+"/?format=json", function(data){
		primary_doctor_information(data[0].doctor_id);
	});
}

function primary_doctor_information(doctor_id){
	//get the primary doctor information
	$.get(backend_url+"/doctors/"+doctor_id+"/?format=json", function(data){
		//set vars, fill dom's
		var first_name = data[0].first_name;
		if((data[0].middle_name)){
			var middle_name = data[0].middle_name;
		}else{
			var middle_name = "";
		}
		var last_name = data[0].last_name;
		var specialization = data[0].specialization;
		var phone_number = data[0].phone_number;
		$("#doctor_name").append(first_name+" "+middle_name+" "+last_name);
		$("#doctor_specialization").append(specialization);
		$("#doctor_phone_number").append(phone_number);
	});
}

function get_physical_information(resident_id){
	$.get(backend_url+"/physical/"+resident_id+"/?format=json", function(data){
		var physical_date = data[0].physical_date;
		//update the DOM
		$("#resident_last_physical_date").append(physical_date);
	});
}

function get_emergency_contact_information(resident_id){
	$.get(backend_url+"/emergencycontacts/"+resident_id+"/?format=json", function(data){
		var first_name = data[0].first_name;
		if((data[0].middle_name)){
			var middle_name = data[0].middle_name;
		}else{
			var middle_name = "";
		}
		var last_name = data[0].last_name;
		var phone_number = data[0].phone_number;
		var address1 = data[0].address1;
		var address2 = data[0].address2;
		var city = data[0].city;
		//why does emergency contact have no state?
		var state = data[0].state;
		if(data[0].state){
			var state = data[0].state;
		}else{
			var state = "";
		}
		var zip_code = data[0].zip_code;
		var relationship = data[0].relationship;
		$("#emergency_contact_name").append(first_name+" "+middle_name+" "+last_name);
		$("#emergency_contact_phone_number").append(phone_number);
		$("#emergency_contact_address").append(address1+" "+address2+", "+state+" "+zip_code);
		$("#emergency_contact_relationship").append(relationship);
	});
}

function get_current_medication_information(resident_id){
	$.get(backend_url+"/medication/"+resident_id+"/?format=json", function(data){
		if(data.length < 1){
			//do nothing?
		}else{
			$("#medication_current_table").empty();
			//build the table
			$("#medication_current_table").append("<tr><th>Medication Name</th><th>Generic Name</th><th>Expire Date</th><th>Prescribed Date</th><th>Dose (Mg)</th><th>Frequency</th><th>Purpose</th><th>Note</th></tr>");
			for(i=0;i<data.length;i++){
				$("#medication_current_table").append(
					"<tr><td>"+data[i].medication_name+
					"</td><td>"+data[i].generic_name+
					"</td><td>"+data[i].med_expire+
					"</td><td>"+data[i].med_prescribed+
					"</td><td>"+data[i].med_dose_mg+
					"</td><td>"+data[i].med_freq+
					"</td><td>"+data[i].med_purpose+
					"</td><td>"+data[i].note+
					"</td></tr>"
				);
			}
		}
	});
}

function get_medication_history(resident_id){
	$.get(backend_url+"/medicationhistory/"+resident_id+"/?format=json", function(data){
		if(data.length < 1){
			//do nothing?
		}else{
			//clear the table just in case
			$("#medication_history_table").empty();
			//build the table
			$("#medication_history_table").append("<tr><th>Medication Name</th><th>Generic Name</th><th>Prescribed Date</th><th>Expire Date</th><th>Dose (Mg)</th><th>Frequency</th><th>Diet</th><th>Purpose</th><th>Note</th></tr>");
			for(i=0;i<data.length;i++){
				$("#medication_history_table").append(
					"<tr><td>"+data[i].med_name+
					"</td><td>"+data[i].generic_name+
					"</td><td>"+data[i].prescribed+
					"</td><td>"+data[i].expiration+
					"</td><td>"+data[i].dosages+
					"</td><td>"+data[i].frequency+
					"</td><td>"+data[i].diets+
					"</td><td>"+data[i].purpose+
					"</td><td>"+data[i].note+
					"</td></tr>"
				);
			}
		}
	});
}

function get_prescription_information(resident_id){
	$.get(backend_url+"/prescription/"+resident_id+"/?format=json", function(data){
		if(data.length < 1){
			//do nothing?
		}else{
			$("#prescription_table").empty();
			//build the table
			$("#prescription_table").append("<tr><th>Prescription Name</th><th>Date Ordered</th><th>Date Received</th><th>Refill Date</th><th>Quantity</th></tr>");
			for(i=0;i<data.length;i++){
				if(data[i].refill_date < date_compare){
					refill_date_danger = "<tr class='danger'>";
					refill_date = "<b>"+data[i].refill_date+"</b>";
				}else{
					refill_date_danger = "<tr>";
					refill_date = data[i].refill_date;
				}
				$("#prescription_table").append(
					refill_date_danger+"<td>"+data[i].prescription_number+
					"</td><td>"+data[i].date_ordered+
					"</td><td>"+data[i].date_received+
					"</td><td>"+refill_date+
					"</td><td>"+data[i].quantity+
					"</td></tr>"
				);
			}
		}
	});
}

function get_hospitalization_history(resident_id){
	$.get(backend_url+"/hospitalization/"+resident_id+"/?format=json", function(data){
		if(data.length < 1){
			//do nothing?
		}else{
			$("#hospitalizations_table").empty();
			//build the table
			$("#hospitalizations_table").append("<tr><th>Hospitalization Date</th><th>Location</th><th>Duration</th><th>Reason</th><th>Medication Changes</th><th>Diagnosis</th><th>Notes</th></tr>");
			for(i=0;i<data.length;i++){
				$("#hospitalizations_table").append(
					"<tr><td>"+data[i].hospitalization_date+
					"</td><td>"+data[i].hospitalization_location+
					"</td><td>"+data[i].duration_of_stay+
					"</td><td>"+data[i].reason+
					"</td><td>"+data[i].medication_changes+
					"</td><td>"+data[i].diagnosis+
					"</td><td>"+data[i].notes+
					"</td></tr>"
				);
			}
		}
	});
}

function get_resident_assessment_information(resident_id){
	$.get(backend_url+"/assessment/"+resident_id+"/?format=json", function(data){
		if(data.length < 1){
			//do nothing?
		}else{
			$("#assessment_table").empty();
			//build the table
			$("#assessment_table").append("<tr><th>Assessment Date</th><th>Assessment Time</th><th>Weight</th><th>Blood Pressure</th><th>Notes</th></tr>");
			for(i=0;i<data.length;i++){
				$("#assessment_table").append(
					"<tr><td>"+data[i].assessment_date+
					"</td><td>"+data[i].assessment_time+
					"</td><td>"+data[i].weight+
					"</td><td>"+data[i].blood_pressure+
					"</td><td>"+data[i].assess_notes+
					"</td></tr>"
				);
			}
		}
	});
}

function get_resident_notes_information(resident_id){
	$.get(backend_url+"/notes/"+resident_id+"/?format=json", function(data){
		if(data.length < 1){
			//do nothing?
		}else{
			$("#notes_table").empty();
			//build the table
			$("#notes_table").append("<tr><th>Notes</th></tr>");
			for(i=0;i<data.length;i++){
				$("#notes_table").append(
					"<tr><td>"+data[i].notes+
					"</td></tr>"
				);
			}
		}
	});
}

function get_resident_allergy_information(resident_id){
	$.get(backend_url+"/allergies/"+resident_id+"/?format=json", function(data){
		if(data.length < 1){
			//do nothing?
		}else{
			$("#allergies_table").empty();
			//build the table
			$("#allergies_table").append("<tr><th>Name</th><th>Description</th></tr>");
			for(i=0;i<data.length;i++){
				$("#allergies_table").append(
					"<tr><td>"+data[i].allergy_title+
					"</td><td>"+data[i].allergy_description+
					"</td></tr>"
				);
			}
		}
	});
}

function get_resident_diet_information(resident_id){
	$.get(backend_url+"/diets/"+resident_id+"/?format=json", function(data){
		if(data.length < 1){
			//do nothing?
		}else{
			$("#diet_table").empty();
			//build the table
			$("#diet_table").append("<tr><th>Name</th><th>Description</th></tr>");
			for(i=0;i<data.length;i++){
				$("#diet_table").append(
					"<tr><td>"+data[i].diet_title+
					"</td><td>"+data[i].diet_description+
					"</td></tr>"
				);
			}
		}
	});
}

function get_resident_emergency_contacts_information(resident_id){
	$.get(backend_url+"/emergencycontacts/"+resident_id+"/?format=json", function(data){
		if(data.length < 1){
			//do nothing?
		}else{
			$("#emergency_contacts_table").empty();
			//build the table
			$("#emergency_contacts_table").append("<tr><th>Name</th><th>Address</th><th>Phone Number</th><th>Relationship</th></tr>");
			for(i=0;i<data.length;i++){
				if(data[i].middle_name){
					var middle_name = data[i].middle_name;
				}else{
					var middle_name = "";
				};
				$("#emergency_contacts_table").append(
					"<tr><td>"+data[i].first_name+" "+middle_name+" "+data[i].last_name+
					"</td><td>"+data[i].address1+" "+data[i].address2+" "+data[i].city+" "+data[i].zip_code+
					"</td><td>"+data[i].phone_number+
					"</td><td>"+data[i].relationship+
					"</td></tr>"
				);
			}
		}
	});
}

function get_all_resident_base_info(){
	//note the patient selection box is special, we do that specifically in the patient_select.html file!
	$.get(backend_url+"/residents/*/?format=json", function( data ) {
		return data;
	});
};