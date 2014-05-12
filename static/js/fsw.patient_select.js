function generate_resident_list_dropdown(){
	$.get(backend_url+"/residents/*/?format=json", function( data ) {
		$("#patient_selection_form_select_box").empty();
		for(i=0;i<data.length;i++){
			var first_name = data[i].first_name;
			if((data[i].middle_name)){
				var middle_name = data[i].middle_name;
			}else{
				var middle_name = "";
			}
			var last_name = data[i].last_name;
			$("#patient_selection_form_select_box").append("<option value='"+data[i].resident_id+"'>"+first_name+" "+middle_name+" "+last_name+"</option>");
		};
	});
}