/*jshint -W069 */

var editor = null;
var level_dialogs = {};
var n_dialog = { "colonel": 0, "assistant": 0, "crazy_doctor": 0};
var current_level = -1;
var current_character = "colonel";
var current_chat = 'colonel';
var current_panel = "main";
var maximum_n_answers = 3;
var max_chat_length = 135;
var tmp_chat_text_part = { "colonel": 0, "assistant": 0, "crazy_doctor": 0};
var skip_dialog = { "colonel": 0, "assistant": 0, "crazy_doctor": 0};
var left_text = false;
var check_code = 0;
var info_character = 'colonel';
var max_n_fails = 2;
var max_n_levels = 9;
var game_score = {};
var totalMissilesUsed = 0;
var coding = false;

var chat_buttons_index = { "colonel": 1, "assistant": 2, "info": 3};
var reverse_chat_buttons_index = { "1": "colonel" , "2": "assistant", "3": "info"};
var tot_sec = 0;

game_score['levels_completed'] = [];


var options = {
	animate: true,
	patternWidth: 100,
	patternHeight: 100,
	grainOpacity: 0.2,
	grainDensity: 3.6,
	grainWidth: 9.3,
	grainHeight: 2
};


$(document).ready(function() {

	editor = ace.edit("text_editor");
	editor.setTheme("ace/theme/terminal");
	editor.setOptions({
  fontSize: "16pt"
	});
	editor.getSession().setMode("ace/mode/javascript");
	make_tutorial();
	$('.replies').hide();
	$('.send_answer').hide();
	if(current_level == -1) {
		$('#start_level_btn').text('Start Level');
		d = new Date();
		sec = 0;

	} else {
		$('#start_level_btn').text('Start Level '+current_level);
	}
	$('#start_level_btn').show();
	$('.ttip').qtip({
		position: {
			target: 'mouse',
			adjust: {
				mouse: true,
				x: 10,
				y: 0
			}
		},
		style: {
			tip: {
				corner: 'left center'
			},
			classes: 'ttip_css'
		}
	});
	$('.change_chat').addClass('not_clickable');
	$('.code_buttons_img').addClass('not_clickable');
	setInterval(function() {
		min = parseInt(sec/60);
		tmp_sec = parseInt(sec%60);
		$('#total_time_summary').text(min+" m " + tmp_sec +" s");
		sec++;
	}, 1000);

	$('#cover_canvas').width(CANVAS_WIDTH);
	$('#cover_canvas').height(CANVAS_HEIGHT);
	$('#cover_canvas').offset($('canvas').offset());
	x_coordinate = $('canvas').offset().left+CANVAS_WIDTH/2-($('#canvas_play_game').width()/2);
	y_coordinate = $('canvas').offset().top+CANVAS_HEIGHT/2-($('#canvas_play_game').height()/2);
	$('#canvas_play_game').offset({'left': x_coordinate, 'top': y_coordinate});


});


function
make_tutorial(){
$('#main_btn').first().attr('data-step', '1');
$('#main_btn').first().attr('data-intro', 'This is the home. Here you can play the game.');
$('#main_btn').first().attr('data-position', 'right');


$('canvas').attr('data-step', '2');
$('canvas').attr('data-intro', 'This is the game screen.  Click here to play!');
$('canvas').attr('data-position', 'right');

$('#coding').attr('data-step', '3');
$('#coding').attr('data-intro', 'This is the game console.  Write here your code!');
$('#coding').attr('data-position', 'right');

$('#chat_window').attr('data-step', '4');
$('#chat_window').attr('data-intro', 'This is the chat window. Here you will receive orders and tips.');
$('#chat_window').attr('data-position', 'left');

$('#replies').attr('data-step', '5');
$('#replies').attr('data-intro', 'This is the answer console. Here you can send your answer during a conversation.');
$('#replies').attr('data-position', 'left');

$('#send_code_btn').attr('data-step', '6');
$('#send_code_btn').attr('data-intro', 'Press this button when your code is ready to be executed.');
$('#send_code_btn').attr('data-position', 'top');

$('#reset_code_btn').attr('data-step', '7');
$('#reset_code_btn').attr('data-intro', 'Press this button when you need to reset the level code.');
$('#reset_code_btn').attr('data-position', 'top');

$('#conversations_btn').first().attr('data-step', '8');
$('#conversations_btn').first().attr('data-intro', 'This is the conversations panel. Here you can read all the previous conversations.');
$('#conversations_btn').first().attr('data-position', 'right');

$('#settings_btn').first().attr('data-step', '9');
$('#settings_btn').first().attr('data-intro', 'This is the settings panel. Here you can see your progress and you can change level.');
$('#settings_btn').first().attr('data-position', 'right');


}



$('#start_level_btn').on('click', function() {
	start_level();

	//current_level = 2;
	//end_level();
});

$('#exit_btn').on('click', function() {
	window.location.href = '/';
});

$('#tutorial_btn').on('click', function() {
	$('#main_btn').trigger('click');
	introJs().onchange(function(targetElement) {
		id = $(targetElement).attr('id');
		if(id == 'conversations_btn') {
			$('#'+id).trigger('click');
		} else if(id == 'settings_btn') {
			$('#'+id).trigger('click');
		}

	}).onexit(function(){
		$('#main_btn').trigger('click');

	}).oncomplete(function(){
		$('#main_btn').trigger('click');

	}).start();


});

$('#send_code_btn').on('click', function() {

	if(!$(this).hasClass('not_clickable')) {
		send_code();
	}
});
$('#reset_code_btn').on('click', function() {

	if(!$(this).hasClass('not_clickable')) {
		reset_code();
	}
});

$(document).click(function(e) {
	if ($(e.target).closest("#coding").length) {
		coding = true;
	} else {
		coding = false;
	}
});

$('#send_level_hash_key_btn').on('click', function() {
	$('#alert_level_hash_key').empty();

	lev = $('#level_hash_key_input_text').val();
	check_key(lev);

});

$('#reset_level_hash_key_btn').on('click', function() {
	$('#alert_level_hash_key').empty();
	lev = $('#level_hash_key_input_text').val('');
});

if (navigator.userAgent.match(/Firefox/i)) {
	$(document).keypress(press_key);
} else {
	$(document).keydown(press_key);
}

function
press_key(e) {

	if(e.keyCode == 13 && !coding) {
		what = $('.dialog_focus_btn').attr('id');
		text = $('#'+what).text();
		chat_id = $('.chat_focus_btn').attr('id');
		if(chat_id !== undefined)
			chat_id = chat_id.replace('_chat_btn', '');

		if($('#start_level_btn').is(":visible")) {
			start_level();
		} else if(chat_id !== undefined && current_chat != chat_id && current_character != 'crazy_doctor') {
			id = $('.chat_focus_btn').attr('id');
			$('#'+id).trigger('click');
		} else if($('#'+what).is(":visible")){
			send_answer(what);
		}
	} else if(e.keyCode == 38 || e.keyCode == 40) {
		index = $('.dialog_focus_btn').attr('id');
		id = current_character+'_answer_';
		index = parseInt(index.replace(id, ''));
		if(e.keyCode == 38) {

			if(index != 1) {
				$('.dialog_focus_btn').removeClass('dialog_focus_btn');
				$('#'+id+(index-1)).addClass('dialog_focus_btn');
			}
		} else if(e.keyCode == 40) {
			if(index != 3 && $('#'+id+(index+1)).is(":visible")) {

				$('.dialog_focus_btn').removeClass('dialog_focus_btn');
				$('#'+id+(index+1)).addClass('dialog_focus_btn');
			}
		}
	} else if(e.keyCode == 37 || e.keyCode == 39) {
		id = $('.chat_focus_btn').attr('id');
		if(id === undefined) {
			id = 'colonel_chat_btn';
			$('#'+id).addClass('chat_focus_btn');
		} else {
			who = id.replace('_chat_btn', "");
			index = parseInt(chat_buttons_index[who]);
			if(proceedToGame === true || current_level == 4 || current_level == 6) {

				if(e.keyCode == 37) {

					if(index != 1) {
						$('.chat_focus_btn').removeClass('chat_focus_btn');
						who  = reverse_chat_buttons_index[(index-1).toString()];
						id = who+'_chat_btn';
						$('#'+id).addClass('chat_focus_btn');
					}
				} else if(e.keyCode == 39) {
					if(index != 3) {
						$('.chat_focus_btn').removeClass('chat_focus_btn');
						who  = reverse_chat_buttons_index[(index+1).toString()];
						id = who+'_chat_btn';
						$('#'+id).addClass('chat_focus_btn');
					}
				}
			}
		}
	}
}

$('.change_chat').on('click', function() {
	if(!$(this).hasClass('not_clickable')) {
		$('.dialog_focus_btn').removeClass('dialog_focus_btn');
		$('.chat_focus_btn').removeClass('chat_focus_btn');


		stop_talking();
		what = $(this).attr('id');
		what = what.replace("_chat_btn", "");
		current_chat = what;
		if(what != "info") {
			$('.div_chat_image').hide();
			$('.chat_text').hide();
			$('#'+what+'_div_chat_image').show();
			$('#'+what+'_chat_text').show();
			$('#'+current_character+'_replies').hide();
			$('#'+what+'_replies').show();
			current_character = what;
			$('#'+current_character+'_answer_1').addClass('dialog_focus_btn');

			if(n_dialog[current_character] === 0 && tmp_chat_text_part[current_character] === 0) {
				$('#'+current_character+'_div_chat_image').addClass('tv_effect');


				grained('.tv_effect',options);
				append_dialogs(current_character);
			}
		} else {
			$('.div_chat_image').hide();
			$('.chat_text').hide();
			$('#'+what+'_chat_text').show();
			$('#'+info_character+'_div_chat_image').show();
			$('#'+current_character+'_replies').hide();



		}

	}
});

$('.change_panel').not("#tutorial_btn").on('click', function() {
	what = $(this).attr('id');
	if(what.indexOf('close') > -1) {
		what = what.replace("_close_btn", "");
		$('#'+what+'_panel').hide('slide');
		$('#main_panel').show('slide');
		current_panel = 'main';
	} else {
		what = what.replace("_btn", "");
		if(what != current_panel) {
			current_panel = what;
			$('.panels').hide();
			$('#'+what+'_panel').show('slide');
		}
	}


});

$('.send_answer').not('#start_level_btn').on('click', function() {
	what = $(this).attr('id');
	send_answer(what);
});


function
send_answer(what) {
	text = $('#'+what).text();
	go_to = $("#"+what).attr('data-goto');


	answer_text = '<p class="answer_text">YOU:'+text+'</p>';
	if(text != 'Next') {
		$('#'+current_character+'_conversation_text').append(answer_text);
		if(go_to != "undefined") {
			n_dialog[current_character] += parseInt(go_to);
		} else {
			n_dialog[current_character]++;
		}

		tmp_chat_text_part[current_character] = 0;

	} else {
		if(tmp_chat_text_part[current_character] == level_dialogs[current_character][n_dialog[current_character]]['text'].length) {
			n_dialog[current_character]++;
			tmp_chat_text_part[current_character] = 0;
		}

	}


	//take all buttons of replies and hide them
	$('#'+current_character+'_replies').children('.send_answer').hide();
	append_dialogs(current_level);
}



function
append_info(what, who, show) {
	if(current_character != 'crazy_doctor') {
		$('#info_chat_text').empty();
		$('#info_chat_text').append(what);
		$('.chat_focus_btn').removeClass('chat_focus_btn');
		$('#info_chat_btn').addClass('chat_focus_btn');

		stop_talking();
		info_character = who;
		if(show == 1) {
			$('#info_chat_btn').trigger('click');
			stop_talking();
			$('#'+info_character+'_div_chat_image').addClass('tv_effect');
			grained('.tv_effect',options);
			$('#info_chat_text').typewrite({
				'delay': 10,
				'callback': stop_talking
			});
		}
	}


}
function
stop_talking() {
	$('#'+info_character+'_div_chat_image').removeClass('tv_effect');
	$('#'+current_character+'_div_chat_image').removeClass('tv_effect');
	$('style[id^="grained-animation"]').remove();
	$('.code_buttons_img').removeClass('not_clickable');
}

function
show_answers() {

	$('.not_clickable').removeClass('not_clickable');
	$('.code_buttons_img').removeClass('not_clickable');

	$('.dialog_focus_btn').removeClass('dialog_focus_btn');
	$('#'+current_character+'_answer_1').addClass('dialog_focus_btn');


	stop_talking();
	n_answers = (level_dialogs[current_character][n_dialog[current_character]]['answers']).length;
	if(n_answers > maximum_n_answers) {
		alert("Too many answers for this dialog");
	} else {
		if(n_answers === 0 || left_text === true) {

			//if we have still dialogs left for the character
			//if(level_dialogs[current_character].length !== parseInt(parseInt(n_dialog[current_character])+2)) {

			id = current_character+'_answer_1';
			$('#'+id).prop('value', 'Next');
			$('#'+id).text('Next');
			$('#'+id).show();
			//}

		} else {
			for(var i = 1; i < n_answers+1; i++) {
				id = current_character+'_answer_'+i;
				text = level_dialogs[current_character][n_dialog[current_character]]['answers'][i-1];
				index = "undefined";
				if(text.substring(1,3) == "--") {
					index = parseInt(text.charAt(0));
					text = text.substring(3);
				}
				$('#'+id).attr('data-goto', index);
				$('#'+id).prop('value', text);
				$('#'+id).text(text);
				$('#'+id).show();
			}
		}
	}
}


function
start_level() {
	get_level(current_level);
	$('.replies').show();
	$('#start_level_btn').hide();

	$('.not_clickable').removeClass('not_clickable');
	$('.code_buttons_img').removeClass('not_clickable');
	if (current_level != 4 && current_level != 6)
		proceedToGame = true;
}

function
end_level() {
	proceedToGame = false;
	//re-initialize variables for dialogs
	left_text = false;
	tmp_chat_text_part = { "colonel": 0, "assistant": 0, "crazy_doctor": 0};
	skip_dialog = { "colonel": 0, "assistant": 0, "crazy_doctor": 0};
	n_dialog = { "colonel": 0, "assistant": 0, "crazy_doctor": 0};
	$('.replies').hide();
	$('.send_answer').hide();
	$('.code_buttons_img').addClass('not_clickable');
	$('#levels_completed_summary').empty();
	game_score["levels_completed"].push(current_level-1);

	l_completed = '<p>';
	for(i = 0; i < game_score['levels_completed'].length; i++) {
		if(i == game_score['levels_completed'].length-1) {
			l_completed += game_score['levels_completed'][i];

		} else {
			l_completed += game_score['levels_completed'][i]+', ';
		}
	}
	l_completed += '</p>';
	$('#levels_completed_summary').append(l_completed);
	$('#avg_time_summary').empty();
	avg_time = 'n.a';

	if(game_score['levels_completed'].length !== 0) {
		avg_time = parseInt((new Date() - d) / 1000);
		avg_time /= game_score['levels_completed'].length;
		m = parseInt(avg_time/60);
		s = parseInt(avg_time%60);
		$('#avg_time_summary').text(m+" m " + s +" s");
	} else {
		$('#avg_time_summary').text(avg_time);
	}

	if(current_level < max_n_levels+1) {
		$('#start_level_btn').text('Start Level '+current_level);
		$('#start_level_btn').show();
		$('.change_chat').addClass('not_clickable');
	} else { //end of game*/
		end_game();

	}


}

function
split_text(input) {
	var len = max_chat_length;
	var curr = len;
	var prev = 0;

	output = [];

	while (input[curr]) {
		if (input[curr++] == ' ') {
			output.push(input.substring(prev,curr));
			prev = curr;
			curr += len;
		}
	}
	output.push(input.substr(prev));
	return output;
}


function
append_dialogs(level) {

	id = current_character+'_chat_text';

	if(level_dialogs[current_character][n_dialog[current_character]] !== undefined && level_dialogs[current_character][n_dialog[current_character]]['text'].length !== 0) {
		$('#'+id).empty();
		text = level_dialogs[current_character][n_dialog[current_character]]['text'][tmp_chat_text_part[current_character]];
		if(skip_dialog[current_character] == 1 && tmp_chat_text_part[current_character] === 0) {

			while(skip_dialog[current_character] == 1) {
				text = level_dialogs[current_character][n_dialog[current_character]]['text'][tmp_chat_text_part[current_character]];
				if(text.substring(1,3) == "--") {
					index = parseInt(text.charAt(0));
					n_dialog[current_character]++;
				} else {
					skip_dialog[current_character] = 0;
				}
			}
		} else if(skip_dialog[current_character] === 0 && text.substring(1,3) == "--") {
			skip_dialog[current_character] = 1;
			text = text.substring(3);
		}
		$('#'+id).append(text);
		if(tmp_chat_text_part[current_character] == level_dialogs[current_character][n_dialog[current_character]]['text'].length-1) {
			left_text = false;
		} else {
			left_text = true;
		}

		if(tmp_chat_text_part[current_character] === 0) {
			dialog_text = '<span class="dialog_text"><span class="character_name">'+current_character.toUpperCase()+'</span>: '+text+'</span>';
		} else {
			if(left_text) {
				dialog_text = text;
			} else {
				dialog_text = text+'</span><p></p>';
			}

		}

		$('#'+current_character+'_conversation_text').append(dialog_text);
		tmp_chat_text_part[current_character]++;

		$('#'+current_character+'_div_chat_image').addClass('tv_effect');

		$('.change_chat').addClass('not_clickable');
		$('.send_code_btn').addClass('not_clickable');
		$('.code_buttons_img').addClass('not_clickable');

		grained('.tv_effect',options);


		$('#'+id).typewrite({
			'delay': 10,
			'callback': show_answers
		});


	}
}

function
make_dialogs(level, dialogs) {
	$.each(dialogs, function( key, value ) {
		tmp_array = new Array();
		level_dialogs[key] = [];
		for(var i = 0; i < dialogs[key].length; i++) {
			obj = dialogs[key][i];

			tmp_text = split_text(obj["text"]);
			//tmp_text = obj["text"].match(new RegExp('.{1,' + max_chat_length+ '}', 'g'));
			obj["text"] = tmp_text;

			index = parseInt(dialogs[key][i]['id'])-1;
			level_dialogs[key].splice(index, 0, obj);

		}
		});
	//append_dialogs(level);
	}

	function
		get_level(level) {

			data = { "request": "get_level", "level": level};
			data = JSON.stringify(data);

			return $.ajax( {
				type: "POST",
				dataType: "json",
				processData: false,
				contentType: 'application/json; charset=utf-8',
				url: "/get_level",data: data
			}).done( function (data, stato) {
				if(current_level == -1) {
					current_level = data.level;
					missileCommand();
				} else {
					current_level = data.level;
				}
				level_text = '<p class="level_text">LEVEL:'+current_level+'</p>';
				$('.conversations_text').append(level_text);
				editor.setValue(data.body);

				$('#left_jump_level').empty();
				$('#right_jump_level').empty();
				$('#username_summary').empty();
				$('#military_rank_summary').empty();


				$('#missiles_used_summary').empty();

				$('#username_summary').append(data.username);
				$('#missiles_used_summary').text(totalMissilesUsed);




				times = current_level % 3; //3 subsets of levels
				if(times === 0) {
					times = 3;
				}
				medal_n = parseInt(current_level/3-0.5)+1;
				for(i = 0; i < times; i++) {
					img = '<img class="rank_image" src="images/medal'+medal_n+'.png" alt="colonel">';
					$('#military_rank_summary').append(img);
				}

				$.each(data.keys, function(index, value) {
					k = '<p>Level '+(parseInt(index)+1)+'</p>';
					v = '<p>'+value+'</p>';

					$('#left_jump_level').append(k);
					$('#right_jump_level').append(v);

				});




				url = window.location.href;
				window.history.pushState("", "", 'index?l='+data.keys[data.keys.length -1]);



				make_dialogs(level, data.dialogs);
				//colonel starts to talk
				current_character = 'colonel';
				$('#'+current_character+'_chat_btn').trigger('click');


			}).fail(function (jqXHR, textStatus, errorThrown) {
				alert("Error:\n" + textStatus);
			}).always(function(data) {
				//called after the completion of get_level, because needs to know which level we are in
				//makeReadonly();
				//to avoid that all the editor is selected by default
				editor.selection.moveTo(0, 0);
				//revert modified function to original ones
				scale = originalScale;
				shootWithOffset = originalSWO;
				defaultCode = editor.getSession().getValue();
			});

		}

	function
		check_key(key) {

			data = { "request": "change_level", "level_hash_key": key};
			data = JSON.stringify(data);


			return $.ajax({
				type: "POST",
				dataType: "json",
				processData: false,
				contentType: 'application/json; charset=utf-8',
				url: "/check_key",
				data: data,
				success: function (data, stato) {
					if(data.status == 'ERROR') {
						al = '<p>Key not found. Please try to insert another one<p>';
						$('#alert_level_hash_key').append(al);

					} else {
						lev = data.level;
						get_level(lev);
						$('#level_hash_key_input_text').val('');
						$('#settings_close_btn').trigger('click');
					}

				},
				error: function (request, stato) {
					alert("E' avvenuto un errore:\n" + stato);
				}});

		}


	function
		reset_code() {

			data = { "request": "reset_code"};
			data = JSON.stringify(data);

			return $.ajax({
				type: "GET",
				dataType: "json",
				processData: false,
				contentType: 'application/json; charset=utf-8',
				url: "/reset_code",
				data: data,
				success: function (data, stato) {
					editor.setValue(data.body);
					append_info('We reverted again the system to its original state. Better it\'s the last time!', 'colonel', 1);

				},
				error: function (request, stato) {
					alert("ERROR:\n" + stato);
				}});
		}

	function
		end_game() {

			game_score["total_time"] = $('#total_time_summary').text();
			game_score["avg_time"] = $('#avg_time_summary').text();
			game_score["totalMissilesUsed"] = totalMissilesUsed;
			data = game_score;
			data = JSON.stringify(data);

			return $.ajax({
				type: "POST",
				dataType: "json",
				processData: false,
				contentType: 'application/json; charset=utf-8',
				url: "/score",
				data: data,
				success: function (data, stato) {

					window.location.href = data.redirect;

				},
				error: function (request, stato) {
					alert("E' avvenuto un errore:\n" + stato);
				}});


		}

	function send_code() {
		check_code = 1;
		level_code = editor.getSession().getValue();
		error = null;

		/*check code*/
		check_code = sandbox(level_code, scope);
		if(parseInt(check_code) === 1) {

			limitEval(level_code + sandbox_context[current_level-1], function(success, returnValue) {
				if (success) {
					if(returnValue != 1) {

						error = returnValue;
						append_info(error, 'assistant', 1);

					} else {

						if(!((current_level == 4 || current_level == 6) && fail > 1)) {
							append_info('We properly received your code. Now let\'s win!', 'colonel', 1);
						}
						exec_code();
					}
				}
				else {
					error = 'The code takes too long to run.  Is there an infinite loop?';
					append_info(error, 'assistant', 1);
				}
			}, 3000);
		} else {
			append_info(check_code, 'assistant', 1);
		}
	}

	function
		exec_code() {


			level_code = editor.getSession().getValue();

			switch (current_level){
				case 1:
					//eval('scale = '+check_level_code);
					scale = new Function('return '+level_code+';')();
					break;
				case 2:
					shootWithOffset = new Function('return ' +level_code+';')();
					break;
				case 3: setNumMissiles = new Function('return '+level_code+';')();
					  break;
				case 4:
					  //check how many times constructor is called
					  count = (level_code.match(/push/g) || []).length;
					  if (count <= 3 ){
						  buildTime = 0;
						  initializeObf = new Function('return '+level_code+';')();
						  if (buildTime <= 9) proceedToGame = true;
					  }
					  else {
						  error = 'too many constructor invocations!';
						  append_info(error, 'assistant', 1);
					  }
					  break;
				case 5:
					  checkHeightObf = new Function('return ' + level_code+';')();
					  break;
				case 6:
					  //check how many times constructor is called
					  count = (level_code.match(/push/g) || []).length;
					  if (count <= 3 ){
						  //check if player used loops
						  if ( (level_code.match(/for/g) || []).length == 0 && (level_code.match(/while/g) || []).length === 0 ) {
							  console.log(level_code);
							  buildTime = 0;
							  initializeRec = new Function('return '+level_code+';')();
							  if (buildTime <= 9) proceedToGame = true;
						  }
						  else {
							  error = 'Loops are not allowed in this level!';
							  append_info(error, 'assistant', 1);
						  }
					  }
					  else {
						  error = 'too many constructor invocations!';
						  append_info(error, 'assistant', 1);
					  }
					  break;
				case 7:
					  playerShoot2 = new Function('return '+ level_code + ';')();
					  break;
				case 8:
					  autofire = new Function('return '+level_code+';')();
					  break;
				case 9:
					  whichAntiMissileBatteryObf = new Function('return '+level_code+';')();
					  break;
			}
			missileCommand();
		}
