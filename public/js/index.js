var editor = null;
$(document).ready(function() {

	get_level(null);
	editor = ace.edit("text_editor");
	    editor.setTheme("ace/theme/terminal");
	        editor.getSession().setMode("ace/mode/javascript");

});

$('#send_code_btn').on('click', function() {
	//TODO keep a var counter for levels
	send_code(2);
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

$(function() {
    var editor = ace.edit("text_editor"),
		 		session  = editor.getSession(),
        Range    = require("ace/range").Range,
        range    = new Range(0, 0, 1, 110),
        markerId = session.addMarker(range, "readonly-highlight");

    session.setMode("ace/mode/javascript");
    editor.keyBinding.addKeyboardHandler({
        handleKeyboard : function(data, hash, keyString, keyCode, event) {
            if (hash === -1 || (keyCode <= 40 && keyCode >= 37)) return false;

            if (intersects(range)) {
                return {command:"null", passEvent:false};
            }
        }
    });

    before(editor, 'onPaste', preventReadonly);
    before(editor, 'onCut',   preventReadonly);

    range.start  = session.doc.createAnchor(range.start);
    range.end    = session.doc.createAnchor(range.end);
    range.end.$insertRight = true;

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

    function intersects(range) {
        return editor.getSelectionRange().intersects(range);
    }

    function preventReadonly(next, args) {
        if (intersects(range)) return;
        next();
    }
});


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
