var backend_url = "http://127.0.0.1:7177";
var date = new Date();
var date_compare = date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate();
var time = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();

//Note this function is only used on add_resident.html!
function get_last_resident_id(){
	$.ajax({
		url: backend_url+"/residents/*/?format=json",
		type: "GET",
		async: false,
		success: function(data){
			var last_id = 0;
			for(i=0;i<data.length;i++){
				last_id = data[i].resident_id;
			};
			//update the dom object
			$("#resident_id").val(last_id);
		}
	});
}

function get_resident_information(resident_id,user_id,call_type){
	//call type: 0 = normal, 1 = edit user
	$.ajax({
		url: backend_url+"/residents/"+resident_id+"/?format=json",
		type: "GET",
		async: false,
		success: function(data){
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
			var last_flu_shot = "";
			var dnr = "";
			if(data[0].last_flu_shot != null){
				last_flu_shot = data[0].last_flu_shot;
				//check if overdue
				if((new Date(last_flu_date)) < ((new Date(last_flu_date))+31556900000)){
					//search for an alert, create one if it is not present
					if(!search_alerts(resident_id,user_id,alert_flu_shot_message)){
						fsw_log(resident_id,user_id,alert_flu_shot_message,0)
					}
				}
			}else{
				last_flu_shot = "Never";
				//search for an alert, create one if it is not present
				if(!search_alerts(resident_id,user_id,alert_flu_shot_message)){
					fsw_log(resident_id,user_id,alert_flu_shot_message,0)
				}
			}
			if(data[0].dnr != null){
				if(data[0].dnr == true){
					dnr = "Yes";
				}else{
					dnr = "No";
				}
			}else{
				dnr = "Yes";
			}
			if(/^(f|ht)tps?:\/\//i.test(data[0].photo)){
				data[0].photo = "static/imgs/no_avatar.png"
			};
			var photo = "../"+data[0].photo;
			if(call_type == 0){
				$("#resident_name").append(first_name+" "+middle_name+" "+last_name);
				$("#resident_address").append(address1+" "+address2+", "+state+" "+zip_code);
				$("#resident_home_phone").append(home_phone);
				$("#resident_cell_phone").append(cell_phone);
				$("#resident_dob").append(dob);
				$("#resident_last_flu_shot").append(last_flu_shot);
				$("#resident_dnr").append(dnr);
				$("#user_image_src").attr('src', photo);
			}else{
				$("#resident_id").val(resident_id);
				$("#action").val("edit");
				$("#first_name").val(first_name);
				$("#middle_name").val(middle_name);
				$("#last_name").val(last_name);
				$("#address1").val(address1);
				$("#address2").val(address2);
				$("#city").val(city);
				$("#state").val(state);
				$("#zip_code").val(zip_code);
				$("#home_phone").val(home_phone);
				$("#cell_phone").val(cell_phone);
				$("#dob").val(dob);
				$("#flu_shot").val(data[0].last_flu_shot);
				$("#file_name").val(data[0].photo);
				$('#file_upload_message').empty();
				$('#file_upload_message').append("<span style='font-weight:bold;color:green'>Current photo saved, use the 'browse' button above to upload a new photo.</span>");
			}
		}
	});
}

function filter_doctors_unlinked(resident_id,user_id){
	$.get(backend_url+"/residentstodoctor/"+resident_id+"/?format=json", function(data){
		get_all_doctors(resident_id,user_id,data);
	});
}

function get_all_doctors(resident_id,user_id,filter_list){
	$("#unlinked_doctors_table").empty();
	$("#unlinked_doctors_table").append("<thead><tr><th>Doctor Name</th><th>Specialization</th><th>Phone Number</th><th>Options</th></tr></thead>");
	var temp_list = [];
	for(var i=0;i<filter_list.length;i++){
		temp_list.push(filter_list[i].doctor_id);
	}
	filter_list = temp_list;
	$.ajax({
		url: backend_url+"/doctors/*/?format=json",
		type: "GET",
		async: false,
		success: function(data){
			for(var i=0;i<data.length;i++){
				if(jQuery.inArray(data[i].doctor_id, filter_list)===-1){
					var middle_name = "";
					if(data[i].middle_name){
						middle_name = data[i].middle_name;
					}else{
						middle_name = "";
					}
					$("#unlinked_doctors_table").append(
						"<tr><td>"+data[i].first_name+" "+middle_name+" "+data[i].last_name+
						"</td><td>"+data[i].specialization+
						"</td><td>"+data[i].phone_number+
						"</td><td>"+
						"<form id='link_to_resident_row' action='#' method='post'>"+
							"<input type='hidden' name='csrfmiddlewaretoken' value='"+csrftoken+"'>"+
							"<input type='hidden' name='resident_id' value='"+resident_id+"'>"+
							"<input type='hidden' name='first_name' value='"+data[i].first_name+"'>"+
							"<input type='hidden' name='middle_name' value='"+middle_name+"'>"+
							"<input type='hidden' name='last_name' value='"+data[i].last_name+"'>"+
							"<input type='hidden' name='doctor_id' value='"+data[i].doctor_id+"'>"+
							"<input type='hidden' name='user_id' value='"+user_id+"'>"+
							"<input type='hidden' name='rd_id' value='0'>"+
							"<button id='row_delete_button' type='submit' class='btn btn-primary'><span class='glyphicon glyphicon-link'></span>&nbsp; Link</button>"+
						"</form>"+
						"<form id='edit_row' action='/add_doctor/' method='get'>"+
							"<input type='hidden' name='csrfmiddlewaretoken' value='"+csrftoken+"'>"+
							"<input type='hidden' name='doctor_id' value='"+data[i].doctor_id+"'>"+
							"<input type='hidden' name='action' value='edit'>"+
							"<button id='row_delete_button' type='submit' class='btn btn-success'><span class='glyphicon glyphicon-edit'></span>&nbsp; Edit</button>"+
						"</form>"+
						"<form id='delete_row' action='#' method='post'>"+
							"<input type='hidden' name='csrfmiddlewaretoken' value='"+csrftoken+"'>"+
							"<input type='hidden' name='resident_id' value='"+data[i].doctor_id+"'>"+
							"<input type='hidden' name='row_id' value='0'>"+
							"<input type='hidden' name='user_id' value='"+user_id+"'>"+
							"<input type='hidden' name='date_time' value='"+date_compare+'T'+time+"'>"+
							"<input type='hidden' name='delete_message' value='Doctor "+data[i].first_name+" "+middle_name+" "+data[i].last_name+" deleted'>"+
							"<input type='hidden' name='type' value='5'>"+
							"<button id='row_delete_button' type='submit' class='btn btn-danger'><span class='glyphicon glyphicon-trash'></span>&nbsp; Delete</button>"+
						"</form>"+
						"</td></tr>"
					);
				}
			}
			if(data.length > 0){
				//add sorting to the table
				$("#unlinked_doctors_table").tablesorter();
				attach_delete_row_jquery();
			}
		}
	});
}

function get_primary_doctor_information(resident_id,is_list_page,user_id){
	//get the primary doctor id
	$.get(backend_url+"/residentstodoctor/"+resident_id+"/?format=json", function(data){
		primary_doctor_information(data,is_list_page,user_id,resident_id);
	});
}

var single_doctor_name = "";
function isolate_doctor_name(input){
	single_doctor_name = input;
}

function fill_doctor_select_box(resident_id){
	//get the primary doctor id
	$.get(backend_url+"/residentstodoctor/"+resident_id+"/?format=json", function(data){
		doctor_select_box_entry(data);
	});
}

function doctor_select_box_entry(doctor_id_list){
	var html_data = "";
	$('#doctor_select_entry_box').empty();
	for(var k=0;k<doctor_id_list.length;k++){
		$.get(backend_url+"/doctors/"+doctor_id_list[k].doctor_id+"/?format=json", function(data){
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
			html_data = "<option value='"+data[0].doctor_id+"'>"+first_name+" "+middle_name+" "+last_name+"</option>";
			$('#doctor_select_entry_box').append(html_data);
		});
	};
}

function get_single_doctor_information(doctor_id){
	$.ajax({
		url: backend_url+"/doctors/"+doctor_id+"/?format=json",
		type: "GET",
		async: false,
		success: function(data){
			var first_name = data[0].first_name;
			if((data[0].middle_name)){
				var middle_name = data[0].middle_name;
			}else{
				var middle_name = "";
			}
			var last_name = data[0].last_name;
			var input = first_name+" "+middle_name+" "+last_name;
			isolate_doctor_name(input);
			if($("#add_new_doctor").get(0)){
				$('#doctor_first_name').val(first_name);
				$('#doctor_middle_name').val(middle_name);
				$('#doctor_last_name').val(last_name);
				$('#doctor_specialization').val(data[0].specialization);
				$('#doctor_phone_number').val(data[0].phone_number);
				$('#action').val("edit");
				$('#row_id').val(data[0].doctor_id);
			}
		}
	});
}

function primary_doctor_information(doctor_id_list,is_list_page,user_id,resident_id){
	//get the primary doctor information.
	var html_data = "";
	if(is_list_page){
		$('#linked_doctors_table').empty();
		//build the table
		$("#linked_doctors_table").append("<thead><tr><th>Doctor Name</th><th>Specialization</th><th>Phone Number</th><th>Options</th></tr></thead>");
	}else{
		$('#doctor_cycle').empty();
	};
	for(var k=0;k<doctor_id_list.length;k++){
		$.ajax({
			url: backend_url+"/doctors/"+doctor_id_list[k].doctor_id+"/?format=json",
			type: "GET",
			async: false,
			success: function(data){
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
				if(is_list_page){
					$("#linked_doctors_table").append(
						"<tr class='success'><td>"+first_name+" "+middle_name+" "+last_name+
						"</td><td>"+specialization+
						"</td><td>"+phone_number+
						"</td><td>"+
						"<form id='delete_row' action='#' method='post'>"+
							"<input type='hidden' name='csrfmiddlewaretoken' value='"+csrftoken+"'>"+
							"<input type='hidden' name='resident_id' value='"+resident_id+"'>"+
							"<input type='hidden' name='row_id' value='"+data[0].doctor_id+"'>"+
							"<input type='hidden' name='user_id' value='"+user_id+"'>"+
							"<input type='hidden' name='date_time' value='"+date_compare+'T'+time+"'>"+
							"<input type='hidden' name='delete_message' value='Doctor "+first_name+" "+middle_name+" "+last_name+" unlinked'>"+
							"<input type='hidden' name='type' value='14'>"+
							"<button id='row_delete_button' type='submit' class='btn btn-warning'><span class='glyphicon glyphicon-ban-circle'></span>&nbsp; Unlink</button>"+
						"</form>"+
						"</td></tr>"
					);
				}else{
					html_data = "<div id='doctor_cycle_information'><ul><li>Name: "+first_name+" "+middle_name+" "+last_name+"</li><li>Specialization: "+specialization+"</li><li>Phone Number: "+phone_number+"</li></ul></div>";
					$('#doctor_cycle').cycle('add', html_data);			
				}
				if((is_list_page) && (k == data.length) && (data.length > 0)){
					//add sorting to the table
					$("#linked_doctors_table").tablesorter();
					attach_delete_row_jquery();
				}
			}
		});
	}
}

function get_physical_information(resident_id){
	$.get(backend_url+"/physical/"+resident_id+"/?format=json", function(data){
		var most_recent_physical = "1979-01-01";
		//find the most recent physical
		for(var i=0;i<data.length;i++){
			if(most_recent_physical < data[i].physical_date){
				most_recent_physical = data[i].physical_date;
			}
		}
		//update the DOM
		$("#resident_last_physical_date").append(most_recent_physical);
				if((new Date(most_recent_physical)) < ((new Date(most_recent_physical))+31556900000)){
					//search for an alert, create one if it is not present
					if(!search_alerts(resident_id,user_id,alert_physical_message)){
						fsw_log(resident_id,user_id,alert_physical_message,0)
					}
				}
	});
}

function get_current_physical_information(resident_id,user_id){
	$.get(backend_url+"/physical/"+resident_id+"/?format=json", function(data){
		if(data.length < 1){
			$("#physical_table").empty();
		}else{
			$("#physical_table").empty();
			//build the table
			$("#physical_table").append("<thead><tr><th>Physical Date</th><th>Doctor</th><th>Notes</th><th>Options</th></tr></thead>");
			for(i=0;i<data.length;i++){
				get_single_doctor_information(data[i].doctor_id);
				$("#physical_table").append(
					"<tr><td>"+data[i].physical_date+
					"</td><td>"+single_doctor_name+
					"</td><td>"+data[i].notes+
					"</td><td>"+
					"<form id='delete_row' action='#' method='post'>"+
						"<input type='hidden' name='csrfmiddlewaretoken' value='"+csrftoken+"'>"+
						"<input type='hidden' name='resident_id' value='"+resident_id+"'>"+
						"<input type='hidden' name='row_id' value='"+data[i].physical_id+"'>"+
						"<input type='hidden' name='user_id' value='"+user_id+"'>"+
						"<input type='hidden' name='date_time' value='"+date_compare+'T'+time+"'>"+
						"<input type='hidden' name='delete_message' value='Deleted physical information - "+data[i].physical_date+", with doctor: "+single_doctor_name+"'>"+
						"<input type='hidden' name='type' value='10'>"+
						"<button id='row_delete_button' type='submit' class='btn btn-danger'><span class='glyphicon glyphicon-trash'></span> Delete</button>"+
					"</form>"+
					"</td></tr>"
				);
			}
			if(data.length > 0){
				//add sorting to the table
				$("#physical_table").tablesorter();
				attach_delete_row_jquery();
			}
		}
	});
}

function get_emergency_contact_information(resident_id,user_id){
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

function get_current_medication_information(resident_id,user_id){
	$.get(backend_url+"/medication/"+resident_id+"/?format=json", function(data){
		if(data.length < 1){
			$("#medication_current_table").empty();
		}else{
			$("#medication_current_table").empty();
			//build the table
			$("#medication_current_table").append("<thead><tr><th>Medication Name</th><th>Generic Name</th><th>Prescribed Date</th><th>Expire Date</th><th>Dose (Mg)</th><th>Frequency</th><th>Purpose</th><th>Note</th><th>Options</th></tr></thead>");
			var exp_date = "";
			var exp_date_danger = "";
			for(i=0;i<data.length;i++){
				if((Date.parse(new Date(data[i].med_expire))) < date.getTime()){
					//search for an alert, create one if it is not present
					//console.log("expired med, searching for log: "+search_alerts(resident_id,user_id,alert_expired_medication_message+" - "+data[i].medication_name) +" "+ data[i].medication_name);
					if(!search_alerts(resident_id,user_id,alert_expired_medication_message+" - "+data[i].medication_name)){
						fsw_log(resident_id,user_id,alert_expired_medication_message+" - "+data[i].medication_name,0)
					}
					exp_date_danger = "<tr class='danger2'>";
					exp_date = "<b>"+data[i].med_expire+"</b>";
				}else{
					exp_date_danger = "<tr>";
					exp_date = data[i].med_expire;
				}
				$("#medication_current_table").append(
					exp_date_danger+"<td>"+data[i].medication_name+
					"</td><td>"+data[i].generic_name+
					"</td><td>"+data[i].med_prescribed+
					"</td><td>"+exp_date+
					"</td><td>"+data[i].med_dose_mg+
					"</td><td>"+data[i].med_freq+
					"</td><td>"+data[i].med_purpose+
					"</td><td>"+data[i].note+
					"</td><td>"+
					"<form id='delete_row' action='#' method='post'>"+
						"<input type='hidden' name='csrfmiddlewaretoken' value='"+csrftoken+"'>"+
						"<input type='hidden' name='resident_id' value='"+resident_id+"'>"+
						"<input type='hidden' name='row_id' value='"+data[i].medication_id+"'>"+
						"<input type='hidden' name='user_id' value='"+user_id+"'>"+
						"<input type='hidden' name='date_time' value='"+date_compare+'T'+time+"'>"+
						"<input type='hidden' name='delete_message' value='Deleted medication - "+data[i].medication_name+"'>"+
						"<input type='hidden' name='type' value='1'>"+
						"<button id='row_delete_button' type='submit' class='btn btn-danger'><span class='glyphicon glyphicon-trash'></span> Delete</button>"+
					"</form>"+
					"</td></tr>"
				);
			}
			//add sorting to the table
			if(data.length > 0){
				$("#medication_current_table").tablesorter();
				attach_delete_row_jquery();
			}
		}
	});
}

function get_medication_history(resident_id,user_id){
	$.get(backend_url+"/medicationhistory/"+resident_id+"/?format=json", function(data){
		if(data.length < 1){
			$("#medication_history_table").empty();
		}else{
			//clear the table just in case
			$("#medication_history_table").empty();
			//build the table
			$("#medication_history_table").append("<thead><tr><th>Medication Name</th><th>Generic Name</th><th>Prescribed Date</th><th>Expire Date</th><th>Dose (Mg)</th><th>Frequency</th><th>Diet</th><th>Purpose</th><th>Note</th><th>Options</th></tr></thead>");
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
					"</td><td>"+
					"<form id='delete_row' action='#' method='post'>"+
						"<input type='hidden' name='csrfmiddlewaretoken' value='"+csrftoken+"'>"+
						"<input type='hidden' name='resident_id' value='"+resident_id+"'>"+
						"<input type='hidden' name='row_id' value='"+data[i].medication_id+"'>"+
						"<input type='hidden' name='user_id' value='"+user_id+"'>"+
						"<input type='hidden' name='date_time' value='"+date_compare+'T'+time+"'>"+
						"<input type='hidden' name='delete_message' value='Deleted medication history - "+data[i].med_name+"'>"+
						"<input type='hidden' name='type' value='2'>"+
						"<button id='row_delete_button' type='submit' class='btn btn-danger'><span class='glyphicon glyphicon-trash'></span> Delete</button>"+
					"</form>"+
					"</td></tr>"
				);
			}
			if(data.length > 0){
				//add sorting to the table
				$("#medication_history_table").tablesorter();
				attach_delete_row_jquery();
			}
		}
	});
}

function get_prescription_information(resident_id,user_id){
	$.get(backend_url+"/prescription/"+resident_id+"/?format=json", function(data){
		if(data.length < 1){
			$("#prescription_table").empty();
		}else{
			$("#prescription_table").empty();
			//build the table
			$("#prescription_table").append("<thead><tr><th>Prescription Name</th><th>Date Ordered</th><th>Date Received</th><th>Refill Date</th><th>Quantity</th><th>Options</th></tr></thead>");
			for(i=0;i<data.length;i++){
				if((new Date(data[i].refill_date)) < date.getTime()){
					//search for an alert, create one if it is not present
					if(!search_alerts(resident_id,user_id,alert_refill_past_medication_message+" - "+data[i].prescription_number)){
						fsw_log(resident_id,user_id,alert_refill_past_medication_message+" - "+data[i].prescription_number,0)
					}
					refill_date_danger = "<tr class='danger2'>";
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
					"</td><td>"+
					"<form id='delete_row' action='#' method='post'>"+
						"<input type='hidden' name='csrfmiddlewaretoken' value='"+csrftoken+"'>"+
						"<input type='hidden' name='resident_id' value='"+resident_id+"'>"+
						"<input type='hidden' name='row_id' value='"+data[i].prescription_number+"'>"+
						"<input type='hidden' name='user_id' value='"+user_id+"'>"+
						"<input type='hidden' name='date_time' value='"+date_compare+'T'+time+"'>"+
						"<input type='hidden' name='delete_message' value='Deleted Prescription - "+data[i].prescription_number+"'>"+
						"<input type='hidden' name='type' value='6'>"+
						"<button id='row_delete_button' type='submit' class='btn btn-danger'><span class='glyphicon glyphicon-trash'></span> Delete</button>"+
					"</form>"+
					"</td></tr>"
				);
			}
			if(data.length > 0){
				//add sorting to the table
				$("#prescription_table").tablesorter();
				attach_delete_row_jquery();
			}
		}
	});
}

function get_hospitalization_history(resident_id,user_id){
	$.get(backend_url+"/hospitalization/"+resident_id+"/?format=json", function(data){
		if(data.length < 1){
			//do nothing?
		}else{
			$("#hospitalizations_table").empty();
			//build the table
			$("#hospitalizations_table").append("<thead><tr><th>Hospitalization Date</th><th>Location</th><th>Reason</th><th>Duration</th><th>Medication Changes</th><th>Diagnosis</th><th>Discharge Plan</th><th>Options</th></tr></thead>");
			for(i=0;i<data.length;i++){
				$("#hospitalizations_table").append(
					"<tr><td>"+data[i].hospitalization_date+
					"</td><td>"+data[i].hospitalization_location+
					"</td><td>"+data[i].reason+
					"</td><td>"+data[i].duration_of_stay+
					"</td><td>"+data[i].medication_changes+
					"</td><td>"+data[i].diagnosis+
					"</td><td>"+data[i].notes+
					"</td><td>"+
					"<form id='delete_row' action='#' method='post'>"+
						"<input type='hidden' name='csrfmiddlewaretoken' value='"+csrftoken+"'>"+
						"<input type='hidden' name='resident_id' value='"+resident_id+"'>"+
						"<input type='hidden' name='row_id' value='"+data[i].hospitalization_id+"'>"+
						"<input type='hidden' name='user_id' value='"+user_id+"'>"+
						"<input type='hidden' name='date_time' value='"+date_compare+'T'+time+"'>"+
						"<input type='hidden' name='delete_message' value='Deleted Hospitalization - "+data[i].hospitalization_date+" at: "+data[i].hospitalization_location+"'>"+
						"<input type='hidden' name='type' value='7'>"+
						"<button id='row_delete_button' type='submit' class='btn btn-danger'><span class='glyphicon glyphicon-trash'></span> Delete</button>"+
					"</form>"+
					"</td></tr>"
				);
			}
			if(data.length > 0){
				//add sorting to the table
				$("#hospitalizations_table").tablesorter();
				attach_delete_row_jquery();
			}
		}
	});
}

function get_resident_assessment_information(resident_id,user_id){
	$.get(backend_url+"/assessment/"+resident_id+"/?format=json", function(data){
		if(data.length < 1){
			//do nothing?
		}else{
			$("#assessment_table").empty();
			//build the table
			$("#assessment_table").append("<thead><tr><th>Assessment Date</th><th>Assessment Time</th><th>Weight</th><th>Blood Pressure</th><th>Notes</th><th>Options</th></tr></thead>");
			for(i=0;i<data.length;i++){
				$("#assessment_table").append(
					"<tr><td>"+data[i].assessment_date+
					"</td><td>"+data[i].assessment_time+
					"</td><td>"+data[i].weight+
					"</td><td>"+data[i].blood_pressure+
					"</td><td>"+data[i].assess_notes+
					"</td><td>"+
					"<form id='delete_row' action='#' method='post'>"+
						"<input type='hidden' name='csrfmiddlewaretoken' value='"+csrftoken+"'>"+
						"<input type='hidden' name='resident_id' value='"+resident_id+"'>"+
						"<input type='hidden' name='row_id' value='"+data[i].assessment_id+"'>"+
						"<input type='hidden' name='user_id' value='"+user_id+"'>"+
						"<input type='hidden' name='date_time' value='"+date_compare+'T'+time+"'>"+
						"<input type='hidden' name='delete_message' value='Deleted Assessment - "+data[i].assessment_date+"'>"+
						"<input type='hidden' name='type' value='3'>"+
						"<button id='row_delete_button' type='submit' class='btn btn-danger'><span class='glyphicon glyphicon-trash'></span> Delete</button>"+
					"</form>"+
					"</td></tr>"
				);
			}
			if(data.length > 0){
				//add sorting to the table
				$("#assessment_table").tablesorter();
				attach_delete_row_jquery();
			}
		}
	});
}

function get_resident_notes_information(resident_id,user_id){
	$.get(backend_url+"/notes/"+resident_id+"/?format=json", function(data){
		if(data.length < 1){
			//do nothing?
		}else{
			$("#notes_table").empty();
			//build the table
			$("#notes_table").append("<thead><tr><th>Notes</th><th>Options</th></tr></thead>");
			for(i=0;i<data.length;i++){
				$("#notes_table").append(
					"<tr><td>"+data[i].notes+
					"</td><td>"+
					"<form id='delete_row' action='#' method='post'>"+
						"<input type='hidden' name='csrfmiddlewaretoken' value='"+csrftoken+"'>"+
						"<input type='hidden' name='resident_id' value='"+resident_id+"'>"+
						"<input type='hidden' name='row_id' value='"+data[i].id+"'>"+
						"<input type='hidden' name='user_id' value='"+user_id+"'>"+
						"<input type='hidden' name='date_time' value='"+date_compare+'T'+time+"'>"+
						"<input type='hidden' name='delete_message' value='Deleted Note'>"+
						"<input type='hidden' name='type' value='11'>"+
						"<button id='row_delete_button' type='submit' class='btn btn-danger'><span class='glyphicon glyphicon-trash'></span> Delete</button>"+
					"</form>"+
					"</td></tr>"
				);
			}
			attach_delete_row_jquery();
		}
	});
}

function get_resident_allergy_information(resident_id,user_id){
	$.get(backend_url+"/allergies/"+resident_id+"/?format=json", function(data){
		if(data.length < 1){
			//do nothing?
		}else{
			$("#allergies_table").empty();
			//build the table
			$("#allergies_table").append("<thead><tr><th>Name</th><th>Description</th><th>Options</th></tr></thead>");
			for(i=0;i<data.length;i++){
				$("#allergies_table").append(
					"<tr><td>"+data[i].allergy_title+
					"</td><td>"+data[i].allergy_description+
					"</td><td>"+
					"<form id='delete_row' action='#' method='post'>"+
						"<input type='hidden' name='csrfmiddlewaretoken' value='"+csrftoken+"'>"+
						"<input type='hidden' name='resident_id' value='"+resident_id+"'>"+
						"<input type='hidden' name='row_id' value='"+data[i].allergy_id+"'>"+
						"<input type='hidden' name='user_id' value='"+user_id+"'>"+
						"<input type='hidden' name='date_time' value='"+date_compare+'T'+time+"'>"+
						"<input type='hidden' name='delete_message' value='Deleted Allergy - "+data[i].allergy_title+"'>"+
						"<input type='hidden' name='type' value='13'>"+
						"<button id='row_delete_button' type='submit' class='btn btn-danger'><span class='glyphicon glyphicon-trash'></span> Delete</button>"+
					"</form>"+
					"</td></tr>"
				);
			}
			if(data.length > 0){
				//add sorting to the table
				$("#allergies_table").tablesorter();
				attach_delete_row_jquery();
			}
		}
	});
}

function get_resident_diet_information(resident_id,user_id){
	$.get(backend_url+"/diets/"+resident_id+"/?format=json", function(data){
		if(data.length < 1){
			//do nothing?
		}else{
			$("#diet_table").empty();
			//build the table
			$("#diet_table").append("<thead><tr><th>Name</th><th>Description</th><th>Options</th></tr></thead>");
			for(i=0;i<data.length;i++){
				$("#diet_table").append(
					"<tr><td>"+data[i].diet_title+
					"</td><td>"+data[i].diet_description+
					"</td><td>"+
					"<form id='delete_row' action='#' method='post'>"+
						"<input type='hidden' name='csrfmiddlewaretoken' value='"+csrftoken+"'>"+
						"<input type='hidden' name='resident_id' value='"+resident_id+"'>"+
						"<input type='hidden' name='row_id' value='"+data[i].diet_id+"'>"+
						"<input type='hidden' name='user_id' value='"+user_id+"'>"+
						"<input type='hidden' name='date_time' value='"+date_compare+'T'+time+"'>"+
						"<input type='hidden' name='delete_message' value='Deleted Diet - "+data[i].diet_title+"'>"+
						"<input type='hidden' name='type' value='12'>"+
						"<button id='row_delete_button' type='submit' class='btn btn-danger'><span class='glyphicon glyphicon-trash'></span> Delete</button>"+
					"</form>"+
					"</td></tr>"
				);
			}
			if(data.length > 0){
				//add sorting to the table
				$("#diet_table").tablesorter();
				attach_delete_row_jquery();
			}
		}
	});
}

function get_resident_emergency_contacts_information(resident_id,user_id){
	$.get(backend_url+"/emergencycontacts/"+resident_id+"/?format=json", function(data){
		if(data.length < 1){
			//do nothing?
		}else{
			$("#emergency_contacts_table").empty();
			//build the table
			$("#emergency_contacts_table").append("<thead><tr><th>Name</th><th>Address</th><th>Phone Number</th><th>Relationship</th><th>Options</th></tr></thead>");
			for(i=0;i<data.length;i++){
				if(data[i].middle_name){
					var middle_name = data[i].middle_name;
				}else{
					var middle_name = "";
				};
				$("#emergency_contacts_table").append(
					"<tr><td>"+data[i].first_name+" "+middle_name+" "+data[i].last_name+
					"</td><td>"+data[i].address1+" "+data[i].address2+" "+data[i].city+" "+data[i].state+ " "+data[i].zip_code+
					"</td><td>"+data[i].phone_number+
					"</td><td>"+data[i].relationship+
					"</td><td>"+
					"<form id='delete_row' action='#' method='post'>"+
						"<input type='hidden' name='csrfmiddlewaretoken' value='"+csrftoken+"'>"+
						"<input type='hidden' name='resident_id' value='"+resident_id+"'>"+
						"<input type='hidden' name='row_id' value='"+data[i].em_id+"'>"+
						"<input type='hidden' name='user_id' value='"+user_id+"'>"+
						"<input type='hidden' name='date_time' value='"+date_compare+'T'+time+"'>"+
						"<input type='hidden' name='delete_message' value='Deleted Emergency Contact - "+data[i].first_name+" "+middle_name+" "+data[i].last_name+", relationship: "+data[i].relationship+"'>"+
						"<input type='hidden' name='type' value='8'>"+
						"<button id='row_delete_button' type='submit' class='btn btn-danger'><span class='glyphicon glyphicon-trash'></span> Delete</button>"+
					"</form>"+
					"</td></tr>"
				);
			}
			if(data.length > 0){
				//add sorting to the table
				$("#emergency_contacts_table").tablesorter();
				attach_delete_row_jquery();
			}
		}
	});
}

function get_current_insurance_information(resident_id,user_id){
	$.get(backend_url+"/insurance/"+resident_id+"/?format=json", function(data){
		if(data.length < 1){
			$("#insurance_table").empty();
		}else{
			$("#insurance_table").empty();
			//build the table
			$("#insurance_table").append("<thead><tr><th>Company</th><th>Policy Number</th><th>Phone Number</th><th>Purpose</th><th>Options</th></tr></thead>");
			for(i=0;i<data.length;i++){
				$("#insurance_table").append(
					"<tr><td>"+data[i].company+
					"</td><td>"+data[i].policy_number+
					"</td><td>"+data[i].phone_number+
					"</td><td>"+data[i].purpose+
					"</td><td>"+
					"<form id='delete_row' action='#' method='post'>"+
						"<input type='hidden' name='csrfmiddlewaretoken' value='"+csrftoken+"'>"+
						"<input type='hidden' name='resident_id' value='"+resident_id+"'>"+
						"<input type='hidden' name='row_id' value='"+data[i].insurance_id+"'>"+
						"<input type='hidden' name='user_id' value='"+user_id+"'>"+
						"<input type='hidden' name='date_time' value='"+date_compare+'T'+time+"'>"+
						"<input type='hidden' name='delete_message' value='Deleted insurance - "+data[i].company+", policy number: "+data[i].policy_number+"'>"+
						"<input type='hidden' name='type' value='4'>"+
						"<button id='row_delete_button' type='submit' class='btn btn-danger'><span class='glyphicon glyphicon-trash'></span> Delete</button>"+
					"</form>"+
					"</td></tr>"
				);
			}
			if(data.length > 0){
				//add sorting to the table
				$("#insurance_table").tablesorter();
				attach_delete_row_jquery();
			}
		}
	});
}

var resident_array = [];
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