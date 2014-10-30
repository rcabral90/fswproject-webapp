function resetForm($form) {
    $form.find('input:text, input:password, input:file, select, textarea').val('');
    $form.find('input:radio, input:checkbox')
         .removeAttr('checked').removeAttr('selected');
}
/* Why does this gigantic ugly funciton exist?
	-> In short we needed to be able to allow the delete or edit event to be called from any dynamically generated row. Unfortunately the way
	we bound this was via the click function - at the time I had no experience with creating my own jquery events.
	
	-> When a delete event is called we unbind the click event entirely and then rebind any click events after we have executed our ajax call,
	this was not necessarily the best way to go about doing it but got the job done. I would highly encourage spending some time on refactoring
	the way delete events are done (using a custom jquery event) that way you do not have to do this as it causes a huge amount of load for the
	browser.
*/
//form submit events for deletion of row
function attach_delete_row_jquery(){
	//unbind the action even if it doesn't exist, this will remove duplicates.
	$("form").unbind();
	//perform a custom submit event
	$("form").submit(function(event){
		//if the id of the element where this submit event is being called from equals 'delete_row'
		if($(this).attr('id') == "delete_row"){
			//prevent the default submit function from happening (necessary for ajax calls)
			event.preventDefault();
			//pop a dialog box to the user
			if(confirm('Are you sure?')){
				//if 'yes' was selected from the dialog box serialize the form into an array
				var info = $(this).serializeArray();
				//perform an ajax call to the delete function and pass all of the form data
				$.ajax({
					type: "POST",
					url: backend_url+"/delete/",
					data: info
				}).done(function(){
					//when complete rebind all of the click events we want.
					//refresh the data table
					var resident_id = $('#delete_row').find('input[name="resident_id"]').val();
					var user_id = $('#delete_row').find('input[name="user_id"]').val();
					//if the medication tab is currently active repopulate and rebind events
					if($('#medication_tab').attr('class') == "active"){
						populate_current_medication_information_tab(resident_id,user_id);
					}
					//ditto for the medication history tab
					if($('#medication_history_tab').attr('class') == "active"){
						populate_medication_history_tab(resident_id,user_id);
					}
					//ditto for the prescriptions tab
					if($('#prescriptions_tab').attr('class') == "active"){
						populate_prescriptions_tab(resident_id,user_id);
					}
					//ditto for the assessments tab
					if($('#assessment_tab').attr('class') == "active"){
						populate_assessment_tab(resident_id,user_id);
					}
					//ditto for the allergies tab
					if($('#allergies_tab').attr('class') == "active"){
						populate_allergy_tab(resident_id,user_id);
					}
					//ditto for the diets tab
					if($('#diet_tab').attr('class') == "active"){
						populate_diet_tab(resident_id,user_id);
					}
					//ditto for the hospitalization tab
					if($('#hospitalization_tab').attr('class') == "active"){
						populate_hospitalization_tab(resident_id,user_id);
					}
					//ditto for the emergency contacts tab
					if($('#emergency_contacts_tab').attr('class') == "active"){
						populate_emergency_contacts_tab(resident_id,user_id);
					}
					//ditto for the notes tab
					if($('#notes_tab').attr('class') == "active"){
						populate_notes_tab(resident_id,user_id);
					}
					//ditto for the physicals tab
					if($('#physical_tab').attr('class') == "active"){
						populate_physical_tab(resident_id,user_id);
					}
					//ditto for the insurance tab
					if($('#insurance_tab').attr('class') == "active"){
						populate_insurance_tab(resident_id,user_id);
					}
					//ditto for the linked doctors box
					if($("#linked_doctors_box").get(0)){
						populate_primary_doctor_information(resident_id,user_id,1);
						populate_unlinked_doctor_information(resident_id,user_id);
					}else{
						//refresh the alerts
						$("#alert_table").empty();
						get_alerts(get_subscribed_resident_list(resident_id,user_id),user_id,"last_login",0);
					}
				});
				return false;
			}else{
				return false;
			}
		}
		//if the event fired from an element has an element id of 'link_to_resident_row' do the following
		//Note that this is used on the doctors->patient linking page
		if($(this).attr('id') == "link_to_resident_row"){
			//prevent the default submit event
			event.preventDefault();
			//serialize the form into an array
			var json = $(this).serializeJSON();
			//edit some array elements so that it passes as the proper type to the database
			json['doctor_id'] = parseInt(json['doctor_id']);
			json['resident_id'] = parseInt(json['resident_id']);
			//set some variables
			var resident_id = parseInt(json['resident_id']);
			var user_id = json['user_id'];
			var information = "Linked doctor "+json['first_name']+" "+json['middle_name']+" "+json['last_name']+" to resident.";
			//log the event
			fsw_log(resident_id,user_id,information,1);
			//stringify the array into json
			json = JSON.stringify(json);
			//do an ajax call
			$.ajax({
				type: "POST",
				contentType: 'application/json',
				url: backend_url+"/residentstodoctor/*/",
				data: json
			}).done(function(){
				//when done create a hidden redirect to the page and redirect the browser - this can be done way better
				$('#doctor_link_unlink_wrapper').html('<form action="/doctor_list/" name="edit_linked_doctor_redirect" method="get" style="display:none;"><input type="hidden" name="csrfmiddlewaretoken" value="'+csrftoken+'"></form>');
				document.forms['edit_linked_doctor_redirect'].submit();
			});
		}
	})
	//form submit events
	//NOTE: All submit events follow the same procedure so only the first one is well documented.
	//when an entry is made under the medication tab
	$('#medication_entry').on("submit", function(event){
		//prevent the default event
		event.preventDefault();
		//serialize the form into an array
		var json = $(this).serializeJSON();
		var resident_id = json['resident_id'];
		var medication_name = json['medication_name'];
		var user_id = json['user_id'];
		//make sure some values are int
		json['resident_id'] = parseInt(json['resident_id']);
		json['med_prescribed'] = (json['med_prescribed']).split("/").reverse().join("-");
		json['med_expire'] = (json['med_expire']).split("/").reverse().join("-");
		//make the array into a json object
		json = JSON.stringify(json);
		//ajax post it
		$.ajax({
			type: "POST",
			contentType: 'application/json',
			url: backend_url+"/medication/*/",
			data: json,
			dataType: "json"
		}).done(function(){
			//when complete create a log for the event
			var information = "Added medication - "+medication_name;
			fsw_log(resident_id,user_id,information,1);
			populate_current_medication_information_tab(resident_id,user_id);
			//clear the form
			resetForm($('#medication_entry'));
			//close the form
			$('#form_open_me').empty();
			$('#form_open_me').append('New Entry');
			$('#medication_entry').slideUp();
		});
		return false;
	})
	$('#medication_history_entry').on("submit", function(event){
		event.preventDefault();
		var json = $(this).serializeJSON();
		var resident_id = json['resident_id'];
		var medication_name = json['med_name'];
		var user_id = json['user_id'];
		delete json['user_id'];
		json['resident_id'] = parseInt(json['resident_id']);
		json['medication_id'] = parseInt(json['medication_id']);
		json['prescribed'] = (json['prescribed']).split("/").reverse().join("-");
		json['expiration'] = (json['expiration']).split("/").reverse().join("-");
		json = JSON.stringify(json);
		$.ajax({
			type: "POST",
			contentType: 'application/json',
			url: backend_url+"/medicationhistory/*/",
			data: json,
			dataType: "json"
		}).done(function(){
			var information = "Added medication history - "+medication_name;
			fsw_log(resident_id,user_id,information,1);
			populate_medication_history_tab(resident_id,user_id);
			//clear the form
			resetForm($('#medication_history_entry'));
			//close the form
			$('#form_open_mhe').empty();
			$('#form_open_mhe').append('New Entry');
			$('#medication_history_entry').slideUp();
		});
		return false;
	})
	$('#prescriptions_entry').on("submit", function(event){
		event.preventDefault();
		var json = $(this).serializeJSON();
		var prescription_number = json['prescription_number'];
		var user_id = json['user_id'];
		var resident_id = json['resident_id'];
		json['medication_id'] = parseInt(json['medication_id']);
		json['resident_id'] = parseInt(json['resident_id']);
		json['prescription_number'] = parseInt(json['prescription_number']);
		json['date_ordered'] = (json['date_ordered']).split("/").reverse().join("-");
		json['date_received'] = (json['date_received']).split("/").reverse().join("-");
		json['refill_date'] = (json['refill_date']).split("/").reverse().join("-");
		json = JSON.stringify(json);
		$.ajax({
			type: "POST",
			contentType: 'application/json',
			url: backend_url+"/prescription/*/",
			data: json,
			dataType: "json"
		}).done(function(){
			var information = "Added prescription - "+prescription_number;
			fsw_log(resident_id,user_id,information,1);
			populate_prescriptions_tab(resident_id,user_id);
			//clear the form
			resetForm($('#prescriptions_entry'));
			//close the form
			$('#form_open_pe').empty();
			$('#form_open_pe').append('New Entry');
			$('#prescriptions_entry').slideUp();
		});
		return false;
	})
	$('#assessments_entry').on("submit", function(event){
		event.preventDefault();
		var json = $(this).serializeJSON();
		var resident_id = json['resident_id'];
		var user_id = json['user_id'];
		json['resident_id'] = parseInt(json['resident_id']);
		json['assessment_time'] = json['assessment_time']+":00";
		json['assessment_date'] = (json['assessment_date']).split("/").reverse().join("-");
		json = JSON.stringify(json);
		$.ajax({
			type: "POST",
			contentType: 'application/json',
			url: backend_url+"/assessment/*/",
			data: json,
			dataType: "json"
		}).done(function(){
			var information = "Added Assessment";
			fsw_log(resident_id,user_id,information,1);
			populate_assessment_tab(resident_id,user_id);
			//clear the form
			resetForm($('#assessments_entry'));
			//close the form
			$('#form_open_ae').empty();
			$('#form_open_ae').append('New Entry');
			$('#assessments_entry').slideUp();
		});
		return false;
	})
	$('#allergy_entry').on("submit", function(event){
		event.preventDefault();
		var json = $(this).serializeJSON();
		var resident_id = json['resident_id'];
		var user_id = json['user_id'];
		var allergy_name = json['allergy_title'];
		json['resident_id'] = parseInt(json['resident_id']);
		json = JSON.stringify(json);
		$.ajax({
			type: "POST",
			contentType: 'application/json',
			url: backend_url+"/allergies/*/",
			data: json,
			dataType: "json"
		}).done(function(){
			var information = "Added allergy - "+allergy_name;
			fsw_log(resident_id,user_id,information,1);
			populate_allergy_tab(resident_id,user_id);
			//clear the form
			resetForm($('#allergy_entry'));
			//close the form
			$('#form_open_ale').empty();
			$('#form_open_ale').append('New Entry');
			$('#allergy_entry').slideUp();
		});
		return false;
	})
	$('#diet_entry').on("submit", function(event){
		event.preventDefault();
		var json = $(this).serializeJSON();
		var resident_id = json['resident_id'];
		var user_id = json['user_id'];
		var diet_name = json['diet_title'];
		json['resident_id'] = parseInt(json['resident_id']);
		json = JSON.stringify(json);
		$.ajax({
			type: "POST",
			contentType: 'application/json',
			url: backend_url+"/diets/*/",
			data: json,
			dataType: "json"
		}).done(function(){
			var information = "Added diet - "+diet_name;
			fsw_log(resident_id,user_id,information,1);
			populate_diet_tab(resident_id,user_id);
			//clear the form
			resetForm($('#diet_entry'));
			//close the form
			$('#form_open_de').empty();
			$('#form_open_de').append('New Entry');
			$('#diet_entry').slideUp();
		});
		return false;
	})
	$('#hospitalizations_entry').on("submit", function(event){
		event.preventDefault();
		var json = $(this).serializeJSON();
		var resident_id = json['resident_id'];
		var user_id = json['user_id'];
		var location = json['hospitalization_location'];
		var reason = json['reason'];
		json['resident_id'] = parseInt(json['resident_id']);
		json['hospitalization_date'] = (json['hospitalization_date']).split("/").reverse().join("-");
		json = JSON.stringify(json);
		$.ajax({
			type: "POST",
			contentType: 'application/json',
			url: backend_url+"/hospitalization/*/",
			data: json,
			dataType: "json"
		}).done(function(){
			var information = "Added hospitalization visit at "+location+", reason: "+reason;
			fsw_log(resident_id,user_id,information,1);
			populate_hospitalization_tab(resident_id,user_id);
			//clear the form
			resetForm($('#hospitalizations_entry'));
			//close the form
			$('#form_open_he').empty();
			$('#form_open_he').append('New Entry');
			$('#hospitalizations_entry').slideUp();
		});
		return false;
	})
	$('#notes_entry').on("submit", function(event){
		event.preventDefault();
		var json = $(this).serializeJSON();
		var resident_id = json['resident_id'];
		var user_id = json['user_id'];
		var note = json['notes'];
		json['resident_id'] = parseInt(json['resident_id']);
		json = JSON.stringify(json);
		$.ajax({
			type: "POST",
			contentType: 'application/json',
			url: backend_url+"/notes/*/",
			data: json,
			dataType: "json"
		}).done(function(){
			var information = "Added Note: '"+note+"'";
			fsw_log(resident_id,user_id,information,1);
			populate_notes_tab(resident_id,user_id);
			//clear the form
			resetForm($('#notes_entry'));
			//close the form
			$('#form_open_ne').empty();
			$('#form_open_ne').append('New Entry');
			$('#notes_entry').slideUp();
		});
		return false;
	})
	$('#physical_entry').on("submit", function(event){
		event.preventDefault();
		var json = $(this).serializeJSON();
		var resident_id = json['resident_id'];
		var user_id = json['user_id'];
		var physical_date = json['physical_date'];
		json['resident_id'] = parseInt(json['resident_id']);
		json['physical_date'] = (json['physical_date']).split("/").reverse().join("-");
		json = JSON.stringify(json);
		$.ajax({
			type: "POST",
			contentType: 'application/json',
			url: backend_url+"/physical/*/",
			data: json,
			dataType: "json"
		}).done(function(){
			var information = "Added Physical: "+physical_date+"";
			fsw_log(resident_id,user_id,information,1);
			doctor_select_box_entry(resident_id);
			get_current_physical_information(resident_id,user_id);
			//clear the form
			resetForm($('#physical_entry'));
			//close the form
			$('#form_open_ph').empty();
			$('#form_open_ph').append('New Entry');
			$('#physical_entry').slideUp();
			//refresh the alerts table
			get_alerts(new Array(resident_id),user_id,"",0);
		});
		return false;
	})
	$('#emergency_contact_entry').on("submit", function(event){
		event.preventDefault();
		var json = $(this).serializeJSON();
		var resident_id = json['resident_id'];
		var user_id = json['user_id'];
		var first_name = json['first_name'];
		var last_name = json['last_name'];
		json['resident_id'] = parseInt(json['resident_id']);
		json = JSON.stringify(json);
		$.ajax({
			type: "POST",
			contentType: 'application/json',
			url: backend_url+"/emergencycontacts/*/",
			data: json,
			dataType: "json"
		}).done(function(){
			var information = "Added Emergency Contact: "+first_name+" "+last_name;
			fsw_log(resident_id,user_id,information,1);
			populate_emergency_contacts_tab(resident_id,user_id);
			//clear the form
			resetForm($('#emergency_contact_entry'));
			//close the form
			$('#form_open_ec').empty();
			$('#form_open_ec').append('New Entry');
			$('#emergency_contact_entry').slideUp();
			//refresh the alerts table
			get_alerts(new Array(resident_id),user_id,"",0);
		});
		return false;
	});
	$('#insurance_entry').on("submit", function(event){
		event.preventDefault();
		var json = $(this).serializeJSON();
		var resident_id = json['resident_id'];
		var user_id = json['user_id'];
		var company = json['company'];
		var policy_number = json['policy_number'];
		json['resident_id'] = parseInt(json['resident_id']);
		json = JSON.stringify(json);
		$.ajax({
			type: "POST",
			contentType: 'application/json',
			url: backend_url+"/insurance/*/",
			data: json,
			dataType: "json"
		}).done(function(){
			var information = "Added Insurance: "+company+", policy number: "+policy_number+"";
			fsw_log(resident_id,user_id,information,1);
			populate_insurance_tab(resident_id,user_id);
			//clear the form
			resetForm($('#insurance_entry'));
			//close the form
			$('#form_open_in').empty();
			$('#form_open_in').append('New Entry');
			$('#insurance_entry').slideUp();
			//refresh the alerts table
			get_alerts(new Array(resident_id),user_id,"",0);
		});
		return false;
	});
	//subscribe / unsubscribe functionality
	$('#subscribe_to_resident').on("submit", function(event){
		event.preventDefault();
		var json = $(this).serializeJSON();
		json['username'] = json['user_id'];
		delete json['user_id'];
		json = JSON.stringify(json);
		$.ajax({
			type: "POST",
			async: false,
			contentType: 'application/json',
			url: backend_url+"/subscriptions/*/",
			data: json,
			dataType: "json"
		}).done(function(){
			$("#not_subscribed_button").hide();
			$("#subscribed_button").show();
			var info = JSON.parse(json);
			get_alerts(get_subscribed_resident_list(new Array(info['resident_id']),info['username']),info['username'],"last_login",0);
		});
		return false;
	});
	$('#unsubscribe_from_resident').on("submit", function(event){
		event.preventDefault();
		var info = $(this).serializeArray();
		$.ajax({
			type: "POST",
			async: false,
			url: backend_url+"/delete/",
			data: info
		}).done(function(){
			$("#not_subscribed_button").show();
			$("#subscribed_button").hide();
			get_alerts(get_subscribed_resident_list(info[1].value,info[2].value),info[2].value,"last_login",0);
		});
		return false;
	});
}


//submit function for adding new residents
$('#add_new_resident').on("submit", function(event){
	//prevent the default submit state
	event.preventDefault();
	//serialize the form into an array
	var json = $(this).serializeJSON();
	var user_id = json['user_id'];
	var first_name = json['first_name'];
	var resident_id = parseInt(json['resident_id']);
	var action = json['action'];
	if((json['middle_name'] != "")){
		var middle_name = json['middle_name'];
	}else{
		var middle_name = "";
	}
	var last_name = json['last_name'];
	//if the form action is 'add' (see add new residents page for more details)
	if(action == "add"){
		//increment the resident id so we dont collide on page refresh / ajax reload
		resident_id++;
		//remove resident_id from the json (database does not need it due to auto-increment features on resident_id field)
		delete json['resident_id'];
		//reverse the date so the database doesn't cry about the entry method (sqlite enjoys EU standard dates)
		json['flu_shot'] = (json['flu_shot']).split("/").reverse().join("-");
		json['date_of_birth'] = (json['date_of_birth']).split("/").reverse().join("-");
		//combine the array into a json object
		json = JSON.stringify(json);
		//submit an ajax post event
		$.ajax({
			type: "POST",
			contentType: 'application/json',
			url: backend_url+"/residents/*/",
			data: json,
			dataType: "json"
		}).done(function(){
			//when done create a log of the event
			var information = "Added Resident: "+first_name+" "+middle_name+" "+last_name;
			fsw_log(resident_id,user_id,information,1);
			//set the resident id on the page
			$('#resident_id').val(resident_id);
			//clear the form
			resetForm($('#add_new_resident'));
			//let the form post to /selector/ with the new resident id number
			$('#add_new_resident_form_wrapper').html('<form action="/selector/" name="new_user_redirect" method="post" style="display:none;"><input type="hidden" name="csrfmiddlewaretoken" value="'+csrftoken+'"><input type="text" name="resident_id" value="' + resident_id + '" /></form>');
			document.forms['new_user_redirect'].submit();
		});
	}else{
		//not an 'add' event, we assume event is 'edit' here.
		json['resident_id'] = parseInt(json['resident_id']);
		json['date_time'] = date_compare+'T'+time;
		json['edit_message'] = "Edit Resident: "+first_name+" "+middle_name+" "+last_name;
		json['type'] = 0;
		json['row_id'] = 0;
		if(json['flu_shot'] == ""){
			json['flu_shot'] = "null";
		}
		$.ajax({
			type: "POST",
			url: backend_url+"/edit/",
			data: json
		}).done(function(){
			//clear the form
			resetForm($('#add_new_resident'));
			//let the form post to /selector/ with the new resident id number
			$('#add_new_resident_form_wrapper').html('<form action="/selector/" name="new_user_redirect" method="post" style="display:none;"><input type="hidden" name="csrfmiddlewaretoken" value="'+csrftoken+'"><input type="text" name="resident_id" value="' + resident_id + '" /></form>');
			document.forms['new_user_redirect'].submit();
		});
	}
	return false;
})
//add new doctor submit event, follows the same methods as the add new resident.
$('#add_new_doctor').on("submit", function(event){
	event.preventDefault();
	var json = $(this).serializeJSON();
	var user_id = json['user_id'];
	var first_name = json['first_name'];
	var action = json['action'];
	var resident_id = parseInt(json['resident_id']);
	var doctor_id = parseInt(json['doctor_id']);
	if((json['middle_name'] != "")){
		var middle_name = json['middle_name'];
	}else{
		var middle_name = "";
	}
	var last_name = json['last_name'];
	if(action == "add"){
		delete json['doctor_id'];
		json = JSON.stringify(json);
		$.ajax({
			type: "POST",
			contentType: 'application/json',
			url: backend_url+"/doctors/*/",
			data: json,
			dataType: "json"
		}).done(function(){
			var information = "Added Doctor: "+first_name+" "+middle_name+" "+last_name;
			fsw_log(0,user_id,information,1);
			//clear the form
			resetForm($('#add_new_doctor'));
			//let the form post to /selector/ with the new resident id number
			$('#add_new_doctor_form_wrapper').html('<form action="/selector/" name="new_user_redirect" method="post" style="display:none;"><input type="hidden" name="csrfmiddlewaretoken" value="'+csrftoken+'"><input type="text" name="resident_id" value="' + resident_id + '" /></form>');
			document.forms['new_user_redirect'].submit();
		});
	}else{
		json['date_time'] = date_compare+'T'+time;
		json['edit_message'] = "Edit Doctor: "+first_name+" "+middle_name+" "+last_name;
		json['type'] = 5;
		$.ajax({
			type: "POST",
			url: backend_url+"/edit/",
			data: json
		}).done(function(){
			//clear the form
			resetForm($('#add_new_doctor'));
			//let the form post to /selector/ with the new resident id number
			$('#add_new_doctor_form_wrapper').html('<form action="/selector/" name="edit_doctor_redirect" method="post" style="display:none;"><input type="hidden" name="csrfmiddlewaretoken" value="'+csrftoken+'"><input type="text" name="resident_id" value="' + resident_id + '" /></form>');
			document.forms['edit_doctor_redirect'].submit();
		});
	}
	return false;
})