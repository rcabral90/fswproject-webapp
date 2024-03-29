/*
	Purpose: Generates the drop-down list for patient selection on patient_select.html
	Input: None
	Output: None
	Manipulated pages: patient_select.html
*/
function generate_resident_list_dropdown(){
	//make a ajax get request to grab all residents
	$.get(backend_url+"/residents/*/?format=json", function( data ) {
		//dom manipulate the selection box to be empty
		$("#patient_selection_form_select_box").empty();
		
		//give a base resident amount
		var resident_amt = 0;
		for(i=0;i<data.length;i++){
			if(data[i].deactivated == 0){
				var first_name = data[i].first_name;
				if((data[i].middle_name)){
					var middle_name = data[i].middle_name;
				}else{
					var middle_name = "";
				}
				var last_name = data[i].last_name;
				$("#patient_selection_form_select_box").append("<option value='"+data[i].resident_id+"'>"+first_name+" "+middle_name+" "+last_name+"</option>");
				resident_amt++;
			};
		};
		
		if(resident_amt == 0){
			//display a nice message about having no residents currently and point them to the add new resident page
			$("#patient_selection_area").remove();
			$("#main_content").append("<p style='text-align:center;font-size:2em;padding-top:25px;'>There are currently no residents within the system, please <a href='/add_resident/'>add one</a>.</p>");
		};
	});
}