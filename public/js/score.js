var current_level = -1;
$(document).ready(function() {
	
get_score();	

});


function
get_score() {

	return $.ajax({
		type: "GET",
		dataType: "json",
		processData: false,
		contentType: 'application/json; charset=utf-8',
		url: "/get_score",
		success: function (data, stato) {
				$('#username_summary').append(data.username);
				current_level = data.level;
				times = current_level % 3; //3 subsets of levels
				if(times === 0) {
					times = 3;
				}
				medal_n = parseInt(current_level/3-0.5)+1;
				for(i = 0; i < times; i++) {
					img = '<img class="rank_image" src="images/medal'+medal_n+'.png" alt="colonel">';
					$('#military_rank_summary').append(img);
				}
				l_completed = '<p>';
				for(i = 0; i < data.levels_completed.length; i++) {
					if(i == data.levels_completed.length-1) {
						l_completed += data.levels_completed[i];

					} else {
						l_completed += data.levels_completed[i]+',';
					}
				}
				l_completed += '</p>';
				$('#levels_completed_summary').append(l_completed);


		},
		error: function (request, stato) {
		}});
}

