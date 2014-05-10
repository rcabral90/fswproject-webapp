function resetForm($form) {
    $form.find('input:text, input:password, input:file, select, textarea').val('');
    $form.find('input:radio, input:checkbox')
         .removeAttr('checked').removeAttr('selected');
}
//form submit events for deletion of row
function attach_delete_row_jquery(){
	$("form").submit(function(event){
		if($(this).attr('id') == "delete_row"){
			event.preventDefault();
			if(confirm('Are you sure?')){
				var info = $(this).serializeArray();
				$.ajax({
					type: "POST",
					url: backend_url+"/delete/",
					data: info
				}).done(function(){
					//refresh the data table
					var resident_id = $('#delete_row').find('input[name="resident_id"]').val();
					var user_id = $('#delete_row').find('input[name="user_id"]').val();
					if($('#medication_tab').attr('class') == "active"){
						get_current_medication_information(resident_id,user_id);
					}
					if($('#medication_history_tab').attr('class') == "active"){
						get_medication_history(resident_id,user_id);
					}
					if($('#prescriptions_tab').attr('class') == "active"){
						get_prescription_information(resident_id,user_id);
					}
					if($('#assessment_tab').attr('class') == "active"){
						get_resident_assessment_information(resident_id,user_id);
					}
					if($('#allergies_tab').attr('class') == "active"){
						get_resident_allergy_information(resident_id,user_id);
					}
					if($('#diet_tab').attr('class') == "active"){
						get_resident_diet_information(resident_id,user_id);
					}
					if($('#hospitalization_tab').attr('class') == "active"){
						get_hospitalization_history(resident_id,user_id);
					}
					if($('#emergency_contacts_tab').attr('class') == "active"){
						get_resident_emergency_contacts_information(resident_id,user_id);
					}
					if($('#notes_tab').attr('class') == "active"){
						get_resident_notes_information(resident_id,user_id);
					}
					if($('#physical_tab').attr('class') == "active"){
						get_current_physical_information(resident_id,user_id);
					}
					if($('#insurance_tab').attr('class') == "active"){
						get_current_insurance_information(resident_id,user_id);
					}
					//refresh the alerts
					get_alerts(resident_id,user_id,"last_login");
				});
				return false;
			}else{
				return false;
			}
		}
	})
}
//form submit events
$('#medication_entry').on("submit", function(event){
	event.preventDefault();
	var json = $(this).serializeJSON();
	var resident_id = json['resident_id'];
	var medication_name = json['medication_name'];
	var user_id = json['user_id'];
	json['resident_id'] = parseInt(json['resident_id']);
	json['med_dose_mg'] = parseInt(json['med_dose_mg']);
	json = JSON.stringify(json);
	$.ajax({
		type: "POST",
		contentType: 'application/json',
		url: backend_url+"/medication/*/",
		data: json,
		dataType: "json"
	}).done(function(){
		var information = "Added medication - "+medication_name;
		fsw_log(resident_id,user_id,information);
		get_current_medication_information(resident_id);
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
	json = JSON.stringify(json);
	$.ajax({
		type: "POST",
		contentType: 'application/json',
		url: backend_url+"/medicationhistory/*/",
		data: json,
		dataType: "json"
	}).done(function(){
		var information = "Added medication history - "+medication_name;
		fsw_log(resident_id,user_id,information);
		get_medication_history(resident_id);
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
	json = JSON.stringify(json);
	$.ajax({
		type: "POST",
		contentType: 'application/json',
		url: backend_url+"/prescription/*/",
		data: json,
		dataType: "json"
	}).done(function(){
		var information = "Added prescription - "+prescription_number;
		fsw_log(resident_id,user_id,information);
		get_prescription_information(resident_id);
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
	json = JSON.stringify(json);
	$.ajax({
		type: "POST",
		contentType: 'application/json',
		url: backend_url+"/assessment/*/",
		data: json,
		dataType: "json"
	}).done(function(){
		var information = "Added Assessment";
		fsw_log(resident_id,user_id,information);
		get_resident_assessment_information(resident_id);
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
		fsw_log(resident_id,user_id,information);
		get_resident_allergy_information(resident_id);
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
		fsw_log(resident_id,user_id,information);
		get_resident_diet_information(resident_id);
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
	json = JSON.stringify(json);
	$.ajax({
		type: "POST",
		contentType: 'application/json',
		url: backend_url+"/hospitalization/*/",
		data: json,
		dataType: "json"
	}).done(function(){
		var information = "Added hospitalization visit at "+location+", reason: "+reason;
		fsw_log(resident_id,user_id,information);
		get_hospitalization_history(resident_id);
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
		fsw_log(resident_id,user_id,information);
		get_resident_notes_information(resident_id);
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
	json = JSON.stringify(json);
	$.ajax({
		type: "POST",
		contentType: 'application/json',
		url: backend_url+"/physical/*/",
		data: json,
		dataType: "json"
	}).done(function(){
		var information = "Added Physical: "+physical_date+"";
		fsw_log(resident_id,user_id,information);
		fill_doctor_select_box(resident_id);
		get_current_physical_information(resident_id,user_id);
		//clear the form
		resetForm($('#physical_entry'));
		//close the form
		$('#form_open_ph').empty();
		$('#form_open_ph').append('New Entry');
		$('#physical_entry').slideUp();
		//refresh the alerts table
		get_alerts(resident_id,user_id,"",0);
	});
	return false;
})
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
		fsw_log(resident_id,user_id,information);
		get_current_insurance_information(resident_id,user_id);
		//clear the form
		resetForm($('#insurance_entry'));
		//close the form
		$('#form_open_in').empty();
		$('#form_open_in').append('New Entry');
		$('#insurance_entry').slideUp();
		//refresh the alerts table
		get_alerts(resident_id,user_id,"",0);
	});
	return false;
})