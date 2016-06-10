$(document).ready(function() {

	get_level(null);
});

$('#send_code_btn').on('click', function() {

	send_code(null, null);
});
$('#reset_code_btn').on('click', function() {

	reset_code(null, null);
});

function
get_level(what) {

	data = { "request": "get_level", "level": 1};
	data = JSON.stringify(data);

	return $.ajax({
		type: "POST",
		dataType: "json",
		processData: false,
		contentType: 'application/json; charset=utf-8',
		url: "/get_level",
		data: data,
		success: function (data, stato) {
			$("#text_editor").append(data.code);	
		},
		error: function (request, stato) {
			alert("E' evvenuto un errore in signal:\n" + stato);
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
			alert(data.status);
			
		},
		error: function (request, stato) {
			alert("E' evvenuto un errore in signal:\n" + stato);
		}});
}

function
send_code(what, where) {

	data = { "request": "send_code"};
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
			alert(data.status);
			
		},
		error: function (request, stato) {
			alert("E' evvenuto un errore in signal:\n" + stato);
		}});
}


