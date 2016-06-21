var editor = null;
$(document).ready(function() {

	get_level(null);
	editor = ace.edit("text_editor");
	    editor.setTheme("ace/theme/terminal");
	        editor.getSession().setMode("ace/mode/javascript");

});

$('#send_code_btn').on('click', function() {

	send_code(1);
});
$('#reset_code_btn').on('click', function() {

	reset_code(null, null);
});

function
get_level(what) {

	data = { "request": "get_level", "level": 2};
	data = JSON.stringify(data);

	return $.ajax({
		type: "POST",
		dataType: "json",
		processData: false,
		contentType: 'application/json; charset=utf-8',
		url: "/get_level",
		data: data,
		success: function (data, stato) {
//			$("#text_editor").empty();

//			$("#text_editor").append(data.body);

			editor.setValue(data.body);
			//editor.setValue('ciao');

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
send_code(level) {
	level_code = editor.getValue();
	data = { "request": "send_code", "level": level, "body": level_code};
	data = JSON.stringify(data);

	var paths = [];
	return $.ajax({
		type: "POST",
		dataType: "json",
		processData: false,
		contentType: 'application/json; charset=utf-8',
		url: "/send_code",
		data: data,
		success: function (data, stato) {

		},
		error: function (request, stato) {
			alert("ERROR:\n" + "There is an syntax error in your code!");
		}});
}
