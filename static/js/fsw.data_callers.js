/* Global Vars */
/* 
	Notes: These vars are set for very specific reasons, explained below.
	
	backend_url = Global variable that defines the back-end server, this can be used to de-couple the front-end and back-end servers if necessary.
	date & date_compare & time = Global variables that set the timezone and date necessary for the alerts to work.
*/
var backend_url = "http://"+window.location.host+":443";
var date = new Date();
var date_compare = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

/* 
	Global function for making a sync ajax call for chaining data. Note that using jquery get would result in async data which can get hairy.
*/
function sync_ajax_call(request){
	var result;
	$.ajax({
		url: request,
		type: "GET",
		async: false
	}).done(function(data){
		result = data;
	});
	return result;
};
/*
	Purpose: Gets the last resident id from the database
	Input: None
	Output: 
		results = int value containing the last id number of the residents table
*/
function get_last_resident_id(){
	var data = sync_ajax_call(backend_url+"/residents/*/?format=json");
	var last_id = 0;
	for(i=0;i<data.length;i++){
		last_id = data[i].resident_id;
	};
	results = last_id;
	return results;
}

/*
	Purpose: Obtains the given resident information from the residents table
	Input: 
		resident_id = int value
	Output:
		data = resident data in a javascript object array
*/
function get_resident_information(resident_id){
	return sync_ajax_call(backend_url+"/residents/"+resident_id+"/?format=json");
}

/*
	Purpose: Obtains the given residents linked doctors
	Input: 
		resident_id = int value
	Output:
		data = object array of linked doctors to a given resident
*/
function get_resident_doctors_linked(resident_id){
	return sync_ajax_call(backend_url+"/residentstodoctor/"+resident_id+"/?format=json");
}

/*
	Purpose: Obtains all doctor information for all doctors in the database.
	Input: 
		resident_id = int value
	Output:
		data = object array of doctor information.
*/
function get_all_doctors(){
	return sync_ajax_call(backend_url+"/doctors/*/?format=json");
}

/*
	Purpose: Obtains a single doctors information.
	Input: 
		doctor_id = int value
	Output:
		data = object array of doctor information.
*/
function get_single_doctor_information(doctor_id){
	return sync_ajax_call(backend_url+"/doctors/"+doctor_id+"/?format=json");
}

/*
	Purpose: Obtains a residents physical information from the physical table.
	Input: 
		resident_id = int value
	Output:
		data = object array of resident physical information.
*/
function get_physical_information(resident_id){
	return sync_ajax_call(backend_url+"/physical/"+resident_id+"/?format=json");
}

/*
	Purpose: Obtains a residents current medication information from the medication table.
	Input: 
		resident_id = int value
	Output:
		data = object array of resident current medication information.
*/
function get_current_medication_information(resident_id){
	return sync_ajax_call(backend_url+"/medication/"+resident_id+"/?format=json");
}

/*
	Purpose: Obtains a residents medication history from the medication history table.
	Input: 
		resident_id = int value
	Output:
		data = object array of resident medication history.
*/
function get_medication_history(resident_id){
	return sync_ajax_call(backend_url+"/medicationhistory/"+resident_id+"/?format=json");
}

/*
	Purpose: Obtains a residents prescription information from the prescription table.
	Input: 
		resident_id = int value
	Output:
		data = object array of resident prescription information.
*/
function get_prescription_information(resident_id){
	return sync_ajax_call(backend_url+"/prescription/"+resident_id+"/?format=json");
}

/*
	Purpose: Obtains a residents hospitalization information from the hospitalization table.
	Input: 
		resident_id = int value
	Output:
		data = object array of resident hospitalization information.
*/
function get_hospitalization_history(resident_id){
	return sync_ajax_call(backend_url+"/hospitalization/"+resident_id+"/?format=json");
}

/*
	Purpose: Obtains a residents assessment information from the assessment table.
	Input: 
		resident_id = int value
	Output:
		data = object array of resident assessment information.
*/
function get_resident_assessment_information(resident_id){
	return sync_ajax_call(backend_url+"/assessment/"+resident_id+"/?format=json");
}

/*
	Purpose: Obtains a residents notes from the notes table.
	Input: 
		resident_id = int value
	Output:
		data = object array of resident notes.
*/
function get_resident_notes_information(resident_id){
	return sync_ajax_call(backend_url+"/notes/"+resident_id+"/?format=json");
}

/*
	Purpose: Obtains a residents allergy information from the allergy table.
	Input: 
		resident_id = int value
	Output:
		data = object array of resident allergy information.
*/
function get_resident_allergy_information(resident_id){
	return sync_ajax_call(backend_url+"/allergies/"+resident_id+"/?format=json");
}

/*
	Purpose: Obtains a residents diet information from the diet table.
	Input: 
		resident_id = int value
	Output:
		data = object array of resident diet information.
*/
function get_resident_diet_information(resident_id,user_id){
	return sync_ajax_call(backend_url+"/diets/"+resident_id+"/?format=json");
}

/*
	Purpose: Obtains a residents emergency contacts from the emergency contacts table.
	Input: 
		resident_id = int value
	Output:
		data = object array of resident emergency contact information.
*/
function get_resident_emergency_contacts_information(resident_id){
	return sync_ajax_call(backend_url+"/emergencycontacts/"+resident_id+"/?format=json");
}

/*
	Purpose: Obtains a residents insurance information from the insurance table.
	Input: 
		resident_id = int value
	Output:
		data = object array of resident insurance information.
*/
function get_current_insurance_information(resident_id,user_id){
	return sync_ajax_call(backend_url+"/insurance/"+resident_id+"/?format=json");
}

//helper variable for subscription list sorting
var resident_array = [];

/*
	Purpose: Obtains a list of resident id's that the current user is subscribed to.
	Input: 
		resident_id = int value
		user_id = int value
	Output:
		resident_array = array of subscribed resident id's for a given user.
*/
function get_subscribed_resident_list(resident_id,user_id){
	//reset the resident array
	resident_array = [];
	$.ajax({
		url :backend_url+"/subscriptions/"+user_id+"/?format=json",
		type: "GET",
		async: false,
		success: function(data){
			var found = 0;
			if(data.length == 0){
				$("#not_subscribed_button").show();
			}else{
				//check if resident is in list
				for(i=0;i<data.length;i++){
					if(data[i].resident_id == resident_id){
						$("#subscribed_button").show();
						found++;
					}
					//build a list of residents
					resident_array.push(data[i].resident_id);
				}
			}
			if(found == 0){
				$("#not_subscribed_button").show();
			}
			attach_delete_row_jquery();
		}
	});
	return resident_array;
}