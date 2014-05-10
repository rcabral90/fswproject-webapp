//Note: If you need to do anything with session variables don't do it here, hardcode it into the html page!
$( document ).ready(function() {
	//tab activation
	$('#medication a').click(function (e) {
	  e.preventDefault()
	  $(this).tab('show')
	  $('#medication_entry').hide();
	})
	$('#medication_history a').click(function (e) {
	  e.preventDefault()
	  $(this).tab('show')
	  $('#medication_history_entry').hide();
	})
	$('#prescriptions a').click(function (e) {
	  e.preventDefault()
	  $(this).tab('show')
	  $('#prescriptions_entry').hide();
	})
	$('#assessments a').click(function (e) {
	  e.preventDefault()
	  $(this).tab('show')
	  $('#asessments_entry').hide();
	})
	$('#allergies a').click(function (e) {
	  e.preventDefault()
	  $(this).tab('show')
	  $('#allergy_entry').hide();
	})
	$('#diet a').click(function (e) {
	  e.preventDefault()
	  $(this).tab('show')
	  $('#diet_entry').hide();
	})
	$('#hospitalizations a').click(function (e) {
	  e.preventDefault()
	  $(this).tab('show')
	  $('#hospitalizations_entry').hide();
	})
	$('#emergency_contacts a').click(function (e) {
	  e.preventDefault()
	  $(this).tab('show')
	  $('#emergency_contacts_entry').hide();
	})
	$('#notes a').click(function (e) {
	  e.preventDefault()
	  $(this).tab('show')
	  $('#notes_entry').hide();
	})
	$('#physical a').click(function (e) {
	  e.preventDefault()
	  $(this).tab('show')
	  $('#physical_entry').hide();
	})
	$('#insurance a').click(function (e) {
	  e.preventDefault()
	  $(this).tab('show')
	  $('#insurance_entry').hide();
	})
	//hidden form stuff
	$('#form_open_me').click(function(){
		if($('#medication_entry').is(":visible")){
			$('#form_open_me').empty();
			$('#form_open_me').append('New Entry');
			$('#medication_entry').slideUp();
		}else{
			$('#medication_entry').slideDown();
			$('#form_open_me').empty();
			$('#form_open_me').append('Close Entry Form');
		}
	})
	$('#form_open_mhe').click(function(){
		if($('#medication_history_entry').is(":visible")){
			$('#form_open_mhe').empty();
			$('#form_open_mhe').append('New Entry');
			$('#medication_history_entry').slideUp();
		}else{
			$('#medication_history_entry').slideDown();
			$('#form_open_mhe').empty();
			$('#form_open_mhe').append('Close Entry Form');
		}
	})
	$('#form_open_pe').click(function(){
		if($('#prescriptions_entry').is(":visible")){
			$('#form_open_pe').empty();
			$('#form_open_pe').append('New Entry');
			$('#prescriptions_entry').slideUp();
		}else{
			$('#prescriptions_entry').slideDown();
			$('#form_open_pe').empty();
			$('#form_open_pe').append('Close Entry Form');
		}
	})
	$('#form_open_ae').click(function(){
		if($('#assessments_entry').is(":visible")){
			$('#form_open_ae').empty();
			$('#form_open_ae').append('New Entry');
			$('#assessments_entry').slideUp();
		}else{
			$('#assessments_entry').slideDown();
			$('#form_open_ae').empty();
			$('#form_open_ae').append('Close Entry Form');
		}
	})
	$('#form_open_ale').click(function(){
		if($('#allergy_entry').is(":visible")){
			$('#form_open_ale').empty();
			$('#form_open_ale').append('New Entry');
			$('#allergy_entry').slideUp();
		}else{
			$('#allergy_entry').slideDown();
			$('#form_open_ale').empty();
			$('#form_open_ale').append('Close Entry Form');
		}
	})
	$('#form_open_de').click(function(){
		if($('#diet_entry').is(":visible")){
			$('#form_open_de').empty();
			$('#form_open_de').append('New Entry');
			$('#diet_entry').slideUp();
		}else{
			$('#diet_entry').slideDown();
			$('#form_open_de').empty();
			$('#form_open_de').append('Close Entry Form');
		}
	})
	$('#form_open_he').click(function(){
		if($('#hospitalizations_entry').is(":visible")){
			$('#form_open_he').empty();
			$('#form_open_he').append('New Entry');
			$('#hospitalizations_entry').slideUp();
		}else{
			$('#hospitalizations_entry').slideDown();
			$('#form_open_he').empty();
			$('#form_open_he').append('Close Entry Form');
		}
	})
	$('#form_open_ece').click(function(){
		if($('#emergency_contacts_entry').is(":visible")){
			$('#form_open_ece').empty();
			$('#form_open_ece').append('New Entry');
			$('#emergency_contacts_entry').slideUp();
		}else{
			$('#emergency_contacts_entry').slideDown();
			$('#form_open_ece').empty();
			$('#form_open_ece').append('Close Entry Form');
		}
	})
	$('#form_open_ne').click(function(){
		if($('#notes_entry').is(":visible")){
			$('#form_open_ne').empty();
			$('#form_open_ne').append('New Entry');
			$('#notes_entry').slideUp();
		}else{
			$('#notes_entry').slideDown();
			$('#form_open_ne').empty();
			$('#form_open_ne').append('Close Entry Form');
		}
	})
	$('#form_open_ph').click(function(){
		if($('#physical_entry').is(":visible")){
			$('#form_open_ph').empty();
			$('#form_open_ph').append('New Entry');
			$('#physical_entry').slideUp();
		}else{
			$('#physical_entry').slideDown();
			$('#form_open_ph').empty();
			$('#form_open_ph').append('Close Entry Form');
		}
	})
	$('#form_open_in').click(function(){
		if($('#insurance_entry').is(":visible")){
			$('#form_open_in').empty();
			$('#form_open_in').append('New Entry');
			$('#insurance_entry').slideUp();
		}else{
			$('#insurance_entry').slideDown();
			$('#form_open_in').empty();
			$('#form_open_in').append('Close Entry Form');
		}
	})
	//I know that this is not conventional but it was the only way to get this to work.
	var resident_list = [
		{ value: 'foobar', data: 'foobar' },
	];
	function get_resident_list(input){
		resident_list = $.map(input, function(item) {
					return { value: item.first_name+" "+item.last_name, data: item };
				})
	};
	$.ajax({
		url: backend_url+"/residents/*/?format=json",
		type: "GET",
		async: false,
		success: function(data){
			get_resident_list(data);
		}
	});
	$('#search_box').autocomplete({
		lookup: resident_list,
		appendTo: $('#outputbox'),
		onSelect: function (suggestion) {
			//add a hidden value
			$('#search_resident_id').val(suggestion.data.resident_id);
			$(this).closest('#patient_selection').submit();
		}
	})
	//enable doctor slides
	$('#doctor_cycle').cycle({
		log: false,
	});
});