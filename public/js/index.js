/*jshint -W069 */

var editor = null;
var level_dialogs = {};
var n_dialog = { "colonel": -1, "assistant": -1, "crazy_doctor": -1};
var current_level = 1;
var current_character = "colonel";
var current_panel = "colonel";
var maximum_n_answers = 3;

$(document).ready(function() {

	get_level(1);
	editor = ace.edit("text_editor");
	editor.setTheme("ace/theme/terminal");
	editor.getSession().setMode("ace/mode/javascript");
	$('.replies').hide();
	$('.send_answer').hide();
	$('.send_answer:contains("Next")').show();
	$('#'+current_character+'_replies').show();

});

$('#send_code_btn').on('click', function() {
	send_code(current_level);
});
$('#reset_code_btn').on('click', function() {

	reset_code(null, null);
});

$('.change_chat').on('click', function() {
	what = $(this).attr('id');
	what = what.replace("_chat_btn", "");
	$('.div_chat_image').hide();
	$('.chat_text').hide();
	$('#'+what+'_div_chat_image').show();
	$('#'+what+'_chat_text').show();
	$('#'+current_character+'_replies').hide();
	$('#'+what+'_replies').show();
	current_character = what;
});

$('.change_panel').on('click', function() {
	what = $(this).attr('id');
	if(what.indexOf('close') > -1) {
		what = what.replace("_close_btn", "");
		$('#'+what+'_panel').hide('slide');
		$('#main_panel').show('slide');
	} else {
		what = what.replace("_btn", "");
		$('.panels').hide();
		$('#'+what+'_panel').show('slide');
	}


});

$('.send_answer').on('click', function() {
	what = $(this).attr('id');
	text = $('#'+what).text();

	answer_text = '<p class="answer_text">YOU:'+text+'</p>';
	if(text != 'Next') {
		$('#'+current_character+'_conversation_text').append(answer_text);
	}
	n_dialog[current_character]++;
	append_dialogs(current_level);
});


function
show_answers() {
	$('#next_dialog_img').show();
	n_answers = (level_dialogs[current_character][n_dialog[current_character]]['answers']).length;
	if(n_answers > maximum_n_answers) {
		alert("Too many answers for this dialog");
	} else {
		if(n_answers === 0) {
			id = current_character+'_answer_1';
			$('#'+id).prop('value', 'Next');
			$('#'+id).text('Next');
			$('#'+id).show();

		} else {
			for(var i = 1; i < n_answers+1; i++) {
				id = current_character+'_answer_'+i;
				$('#'+id).prop('value',level_dialogs[current_character][n_dialog[current_character]]['answers'][i-1]);
				$('#'+id).text(level_dialogs[current_character][n_dialog[current_character]]['answers'][i-1]);
				$('#'+id).show();
			}
		}
	}
}




function
append_dialogs(level) {

	id = current_character+'_chat_text';

	if(level_dialogs[current_character][n_dialog[current_character]]['text'] !== undefined) {
		$('#next_dialog_img').hide();
		$('#'+id).empty();
		text = level_dialogs[current_character][n_dialog[current_character]]['text'];
		$('#'+id).append(text);
		dialog_text = '<p class="dialog_text">'+current_character+': '+text+'</p>';
		$('#'+current_character+'_conversation_text').append(dialog_text);

		$('#'+id).typewrite({
			'delay': 10,
			//'delay': 100,
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
			index = parseInt(dialogs[key][i]['id'])-1;
			level_dialogs[key].splice(index, 0, obj);
		}
	});
	append_dialogs(level);
}

function
get_level(level) {

	data = { "request": "get_level", "level": level};
	data = JSON.stringify(data);

	/*FIXME to do when ajax success*/
	current_level = level;


	return $.ajax({
		type: "POST",
		dataType: "json",
		processData: false,
		contentType: 'application/json; charset=utf-8',
		url: "/get_level",
		data: data,
		success: function (data, stato) {

			level_text = '<p class="level_text">LEVEL:'+current_level+'</p>';
			$('.conversations_text').append(level_text);
			editor.setValue(data.body);
			make_dialogs(level, data.dialogs);

		},
		error: function (request, stato) {
			alert("E' avvenuto un errore:\n" + stato);
	}});

}

function
reset_code(what, where) {

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
		},
		error: function (request, stato) {
			alert("ERROR:\n" + stato);
		}});
}

function
send_code(level_id) {
	level_code = editor.getValue();
	console.log('codice mandato dall\'utente: ' + JSON.stringify(level_code));

	if (level_id == 2){
		//here happens the magic
		initializeLevel = new Function(level_code);
		missileCommand();
	}

}
