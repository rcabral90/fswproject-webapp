function fsw_log(resident_id,user_id,information){
	//alert id, resident_id, username, general_text, flag, date_time_modified
	//create the log info json, note that 'date_compare' and 'time' is defined in fsw.data_callers.js
	//flag info: 0 = unread, 1 = read
	var log_info = {
		"resident_id": parseInt(resident_id), 
		"username": user_id, 
		"general_text": information, 
		"flag": 0, 
		"date_time_modified": date_compare+'T'+time
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
			if(data.length < 1){
				//hide the alerts area
				$("#alert_box").hide();
			}else{
				//build the table
				$("#alert_table").append("<thead><tr><th>Resident Name</th><th>Information</th><th>Changed By</th><th>Date & Time</th><th>Options</th></tr></thead>");
				for(i=0;i<data.length;i++){
					var log_dt = data[i].date_time_modified.split("T");
					if(ignore_flags){
						alert_amount++;
						$("#alert_table").append(
							"<tr class='warning'><td>"+resident_info[0].first_name+" "+resident_info[0].last_name+
							"</td><td>"+data[i].general_text+
							"</td><td>"+data[i].username+
							"</td><td>"+log_dt[0]+" @ "+log_dt[1]+
							"</td><td>"+
							"</td></tr>"
						);
					}else{
						//ignore flags is set to 0, only add unread messages
						if(data[i].flag == 0){
							alert_amount++;
							$("#alert_table").append(
								"<tr class='warning'><td>"+resident_info[0].first_name+" "+resident_info[0].last_name+
								"</td><td>"+data[i].general_text+
								"</td><td>"+data[i].username+
								"</td><td>"+log_dt[0]+" @ "+log_dt[1]+
								"</td><td>"+
								"<form id='delete_row' action='#' method='post'>"+
									"<input type='hidden' name='csrfmiddlewaretoken' value='"+csrftoken+"'>"+
									"<input type='hidden' name='resident_id' value='"+resident_id+"'>"+
									"<input type='hidden' name='row_id' value='"+data[i].alert_id+"'>"+
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
					//add sorting to the table
					$("#alert_table").tablesorter();
				}
			}
		}
	});
};