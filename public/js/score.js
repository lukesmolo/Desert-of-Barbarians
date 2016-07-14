var current_level = -1;
var count = -1;
var elements = ["info_summary_title", "username_summary", "military_rank_summary", "levels_completed_summary", "total_time_summary", "avg_time_summary", "missiles_used_summary", "credits"];

$(document).ready(function() {

	$('#info_summary').children().hide();	
	$('#credits').hide();	
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
			//	append_text();
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
					l_completed += data.levels_completed[i]+', ';
				}
			}
			l_completed += '</p>';
			$('#levels_completed_summary').append(l_completed);
			$('#total_time_summary').append(data.total_time);
			$('#avg_time_summary').append(data.avg_time);
			$('#missiles_used_summary').append(data.totalMissilesUsed);


		},
		error: function (request, stato) {
		}

	}).done(function () {
		append_text();
	});
}

function
append_text() {
	count++;
	if(count < 2*elements.length) {
		if(count%2 !== 0) {
			i = parseInt((parseInt((count))+parseInt(1))/2);
			//alert('#'+elements[i]);
			//$('#'+elements[i]).before().show();
			if(elements[i] != 'credits') {

			$('#'+elements[i]).prev().typewrite({
				'delay': 50,
				'callback': append_text
			});
			} else {
				append_text();
			}

		} else {
			i = parseInt(parseInt(count)/2);
			//alert('#'+elements[i]);
			//$('#'+elements[i]).show();
			if(elements[i] != 'military_rank_summary') {
				$('#'+elements[i]).typewrite({
					'delay': 50,
					'callback': append_text
				});
			} else {
				$('#'+elements[i]).show();
				append_text();
			}

		}
	}


}

