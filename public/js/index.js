/*jshint -W069 */

var editor = null;
var level_dialogs = {};
var n_dialog = { "colonel": -1, "assistant": -1, "crazy_doctor": -1};
var current_level = 1;
var current_character = "colonel";
var current_panel = "main";
var maximum_n_answers = 3;



$(document).ready(function() {

	editor = ace.edit("text_editor");
	get_level(-1); //FIXME get level defined by server!
	makeReadonly();
	editor.setTheme("ace/theme/terminal");
	editor.getSession().setMode("ace/mode/javascript");
	$('.replies').hide();
	$('.send_answer').hide();
	$('.send_answer:contains("Next")').show();
	$('#'+current_character+'_replies').show();
});

function makeReadonly(){
	var Range = ace.require('ace/range').Range;
	var range1    = new Range(0,0,0,100);
	switch (current_level) {
		case -1:   var range2  = new Range(6, 0, 14 ,100);

	}
	var markerId1 = editor.getSession().addMarker(range1, "readonly-highlight");
  var markerId2 = editor.getSession().addMarker(range2, "readonly-highlight");

	editor.keyBinding.addKeyboardHandler({
        handleKeyboard : function(data, hash, keyString, keyCode, event) {
            if (hash === -1 || (keyCode <= 40 && keyCode >= 37)) return false;

            if (intersects(range1)) {
                return {command:"null", passEvent:false};
            }

						if (intersects(range2)) {
                return {command:"null", passEvent:false};
            }
        }
    });

		function intersects(range) {
        return editor.getSelectionRange().intersects(range);
    }

		/*
		//FIXME to prevent cut and paste
    //prevent keyboard editing
    range1.start  = editor.getSession().doc.createAnchor(range1.start);
    range1.end = editor.getSession().doc.createAnchor(range1.end);
    range1.end.$insertRight = true;
		//prevent keyboard editing
    range2.start  = editor.getSession().doc.createAnchor(range2.start);
    range2.end = editor.getSession().doc.createAnchor(range2.end);
    range2.end.$insertRight = true;

    function before(obj, method, wrapper) {
        var orig = obj[method];
        obj[method] = function() {
            var args = Array.prototype.slice.call(arguments);
            return wrapper.call(this, function(){
                return orig.apply(obj, args);
            }, args);
        }

        return obj[method];
    }

    function preventReadonly(next, args) {
        if (intersects(range1)) return;
        if (intersects(range2)) return;
        next();
    }*/

}

$('#tutorial_btn').on('click', function() {
	introJs().start();
});

$('#send_code_btn').on('click', function() {
	send_code(current_level);
});
$('#reset_code_btn').on('click', function() {

	reset_code(null, null);
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

$('.change_panel').not("#tutorial_btn").on('click', function() {
	what = $(this).attr('id');
	if(what.indexOf('close') > -1) {
		what = what.replace("_close_btn", "");
		$('#'+what+'_panel').hide('slide');
		$('#main_panel').show('slide');
	} else {
		what = what.replace("_btn", "");
		if(what != current_panel) {
			current_panel = what;
			$('.panels').hide();
			$('#'+what+'_panel').show('slide');
		}
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
	//current_level = level;


	return $.ajax({
		type: "POST",
		dataType: "json",
		processData: false,
		contentType: 'application/json; charset=utf-8',
		url: "/get_level",
		data: data,
		success: function (data, stato) {

			//if(current_level == -1)
			current_level = data.level;
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
	numlines = editor.getSession().getLength();
	level_code_strings = editor.getSession().getLines(1, numlines -3); //array starts from zero, minus last free line and line with }
	level_code = level_code_strings[0];
	for (i = 1; i<numlines - 3; i++) level_code = level_code + level_code_strings[i];
	//level_code = level_code_strings.join(); //FIXME more elegant but doesn't work
	console.log('codice mandato dall\'utente: ' + JSON.stringify(level_code));

	if (level_id == 1){
		//here happens the magic
		initializeLevel = new Function(level_code);
		missileCommand();
	}

}
