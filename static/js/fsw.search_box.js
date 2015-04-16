$( document ).ready(function() {
	//I know that this is not conventional but it was the only way to get this to work.
	var resident_list = [
		{ value: 'foobar', data: 'foobar' },
	];
	//function to parse the resident list into something more readable for our autocomplete jquery plugin
	function get_resident_list(input){
		var residents_temp = [];
		//parse data for deactivated residents
		for(i=0;i<input.length;i++){
			if(input[i].deactivated == 0){
				residents_temp.push(input[i]);
			}
		};
		input = residents_temp;
		resident_list = $.map(input, function(item) {
					return { value: item.first_name+" "+item.last_name, data: item };
				})
	};
	//ajax call to get the full resident list
	$.ajax({
		url: backend_url+"/residents/*/?format=json",
		type: "GET",
		async: false,
		success: function(data){
			get_resident_list(data);
		}
	});
	//dom manipulate the search box to auto-complete known residents
	$('#search_box').autocomplete({
		lookup: resident_list,
		appendTo: $('#outputbox'),
		onSelect: function (suggestion) {
			//add a hidden value
			$('#search_resident_id').val(suggestion.data.resident_id);
			$(this).closest('#patient_selection').submit();
		}
	})
});