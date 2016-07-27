var username = null;
var level_hash_key = null;

var empty_username_error = '<p>Field Username is required</p>';

$(document).ready(function() {

	$('#title').typewrite({
		'delay': 80
	});

	$('#send_login').on('click', function() {

		$('#error_alert').empty();
		username = $('#username_input').val();
		level_hash_key = $('#level_hash_key_input').val();
		if(username === '') {
			$('#error_alert').append(empty_username_error);
		} else {
			login();
		}
	});
});

$(document).keypress(function(e) {
	if(e.which == 13) {
		$('#send_login').trigger('click');
	}
});

function
login() {

	data = { "username": username, "level_hash_key": level_hash_key};
	data = JSON.stringify(data);

	return $.ajax({
		type: "POST",
		dataType: "json",
		processData: false,
		contentType: 'application/json; charset=utf-8',
		url: "/login",
		data: data,
		success: function (data, stato) {
			if(data.status != 'ERROR') {

				 window.location.href = data.redirect;

			} else {
				$('#error_alert').empty();
				$('#error_alert').append('<p>'+data.what+'</p>');
			}

		},
		error: function (request, stato) {
			alert("An error occured:\n" + stato);
	}});

}
