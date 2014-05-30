var alert_physical_message = "Resident is due for a physical.";
var alert_flu_shot_message = "Resident is due for a flu shot.";
var alert_expired_medication_message = "Resident medication is expired!";
var alert_expire_soon_medication_message = "Resident medication is about to expire!";
var alert_refill_soon_medication_message = "Resident medication requires a refill soon.";
var alert_refill_past_medication_message = "Resident medication is past due for a refill.";
function fsw_log(resident_id,user_id,information,type){
	//alert id, resident_id, username, general_text, flag, date_time_modified
	//create the log info json, note that 'date_compare' and 'time' is defined in fsw.data_callers.js
	//flag info: 0 = unread, 1 = read
	//DO NOT CONFUSE TYPE FOR LOGS WITH TYPES FOR DELETE / EDIT FUNCTIONS, BAD THINGS WILL HAPPEN!
	//type info: 0 = alert, 1 = log
	var log_info = {
		"resident_id": parseInt(resident_id), 
		"username": user_id, 
		"general_text": information, 
		"flag": 0, 
		"date_time_modified": date_compare+'T'+time,
		"type": type
	};
	log_info = JSON.stringify(log_info);
	$.ajax({
		type: "POST",
		contentType: 'application/json',
		url: backend_url+"/alerts/*/",
		async: false,
		data: log_info,
		dataType: "json"
	}).done(function(){
		//console logging
		//DEBUG
		//console.log(log_info);
	});
};
var resident_info = [
	{ first_name: 'foobar', last_name: 'foobar' },
];
function get_resident_info(input){
	resident_info = $.map(input, function(item) {
				return { first_name: item.first_name, last_name: item.last_name };
			})
};
function get_alerts(resident_id,user_id,last_login,ignore_flags){
	//note that alerts are type = 0!
	//get the resident name
	$.ajax({
		url: backend_url+"/residents/"+resident_id+"/?format=json",
		type: "GET",
		async: false,
		success: function(data){
			get_resident_info(data);
		}
	});
	//TODO: parse last login for compare
	var last_login = "2014-05-07T14:38:00";
	last_login = last_login.split("T");
	//note last_login[0] = date, last_login[1] = time
	
	//query for alerts
	$.ajax({
		url: backend_url+"/alerts/"+resident_id+"/?format=json",
		type: "GET",
		async: false,
		success: function(data){
			$("#alert_table").empty();
			var alert_amount = 0;
			var alerts = [];
			for(var i=0;i<data.length;i++){
				if(data[i].type == 0){
					alerts.push(data[i]);
				}
			}
			//free up some rams
			delete data;
			if(alerts.length < 1){
				//hide the alerts area
				$("#alert_box").hide();
				if($("#alerts_page_information").get(0)){
					$("#alerts_page_information").append("There are currently no alerts.");
				}
			}else{
				//build the table
				$("#alert_table").append("<thead><tr><th>Resident Name</th><th>Information</th><th>Changed By</th><th>Date & Time</th><th>Options</th></tr></thead>");
				for(i=(alerts.length)-1;i>=0;i--){
					var log_dt = alerts[i].date_time_modified.split("T");
					if(ignore_flags){
						alert_amount++;
						$("#alert_table").append(
							"<tr class='warning'><td>"+resident_info[0].first_name+" "+resident_info[0].last_name+
							"</td><td>"+alerts[i].general_text+
							"</td><td>"+alerts[i].username+
							"</td><td>"+log_dt[0]+" @ "+log_dt[1]+
							"</td><td>"+
							"</td></tr>"
						);
					}else{
						//ignore flags is set to 0, only add unread messages
						if(alerts[i].flag == 0){
							alert_amount++;
							$("#alert_table").append(
								"<tr class='warning'><td>"+resident_info[0].first_name+" "+resident_info[0].last_name+
								"</td><td>"+alerts[i].general_text+
								"</td><td>"+alerts[i].username+
								"</td><td>"+log_dt[0]+" @ "+log_dt[1]+
								"</td><td>"+
								"<form id='delete_row' action='#' method='post'>"+
									"<input type='hidden' name='csrfmiddlewaretoken' value='"+csrftoken+"'>"+
									"<input type='hidden' name='resident_id' value='"+resident_id+"'>"+
									"<input type='hidden' name='row_id' value='"+alerts[i].alert_id+"'>"+
									"<input type='hidden' name='user_id' value='"+user_id+"'>"+
									"<input type='hidden' name='date_time' value='"+date_compare+'T'+time+"'>"+
									"<input type='hidden' name='delete_message' value='Alert Acknowledged'>"+
									"<input type='hidden' name='type' value='9'>"+
									"<button id='row_delete_button' type='submit' class='btn btn-warning'><span class='glyphicon glyphicon-ok'></span>&nbsp;</button>"+
								"</form>"+
								"</td></tr>"
							);
						}
					}
				}
				$("#alert_count").empty();
				$("#alert_count").append("Alerts ("+alert_amount+")");
				if(alert_amount < 1){
					//hide the alerts area
					$("#alert_box").hide();
				}else{
					$("#alert_box").show();
					$("#alerts_link").val("Alerts ("+alert_amount+")");
					//add sorting to the table
					$("#alert_table").tablesorter();
				}
			}
		}
	});
};
var found = 0;
function set_found(value){
	found = value;
};
function addDays(date, days) {
    var result = new Date(date);
    result.setDate(date.getDate() + days);
    return result;
}
function search_alerts(resident_id,user_id,alert_text){
	//looks for an alert (NOTE ONLY ALERTS) with the same text for the same day so we don't duplicate alerts.
	//return 1 if alert was found, 0 if not.
	set_found(0);
	$.ajax({
		url: backend_url+"/alerts/"+resident_id+"/?format=json",
		type: "GET",
		async: false,
		success: function(data){
			var alert_amount = 0;
			var alerts = [];
			for(var i=0;i<data.length;i++){
				if(data[i].type == 0){
					alerts.push(data[i]);
				}
			}
			//free up some rams
			delete data;
			for(i=0;i<alerts.length;i++){
				var log_dt = alerts[i].date_time_modified.split("T");
				//find that log!
				if((alerts[i].resident_id == resident_id) && (alerts[i].username == user_id) && (alerts[i].general_text == alert_text) && (Date.parse(new Date(log_dt[0]))) <= (addDays(new Date(date_compare),1))){
					set_found(1);
					break;
				}
			}
		}
	});
	return found;
}
function get_logs(resident_id,user_id){
	//note that log are type = 1!
	//get the resident name
	$.ajax({
		url: backend_url+"/residents/"+resident_id+"/?format=json",
		type: "GET",
		async: false,
		success: function(data){
			get_resident_info(data);
		}
	});
	//query for logs
	$.ajax({
		url: backend_url+"/alerts/"+resident_id+"/?format=json",
		type: "GET",
		async: false,
		success: function(data){
			$("#logs_table").empty();
			var log_amount = 0;
			var logs = [];
			for(var i=0;i<data.length;i++){
				if((data[i].type == 1) || (data[i].type == null)){
					logs.push(data[i]);
					log_amount++;
				}
			}
			//free up some rams
			delete data;
			if(logs.length < 1){
				$("#log_box").hide();
			}else{
				//build the table
				$("#log_table").append("<thead><tr><th>Resident Name</th><th>Information</th><th>Changed By</th><th>Date & Time</th><th>Options</th></tr></thead>");
				for(i=(logs.length)-1;i>=0;i--){
					var log_dt = logs[i].date_time_modified.split("T");
					$("#log_table").append(
						"<tr class='warning'><td>"+resident_info[0].first_name+" "+resident_info[0].last_name+
						"</td><td>"+logs[i].general_text+
						"</td><td>"+logs[i].username+
						"</td><td>"+log_dt[0]+" @ "+log_dt[1]+
						"</td><td>"+
						"</td></tr>"
					);
				}
				$("#log_count").empty();
				$("#log_count").append("Logs ("+log_amount+")");
				if(log_amount < 1){
					//hide the alerts area
					$("#log_box").hide();
				}else{
					$("#log_box").show();
					//add sorting to the table
					$("#log_table").tablesorter();
				}
			}
		}
	});
};