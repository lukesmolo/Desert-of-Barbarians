/*jshint -W069 */
var io   = require('socket.io'),
    url  = require('url'),
    express = require('express'),
    http=require('http');
var path = require('path');
var bodyParser = require('body-parser');
var crypto = require('crypto');

var fs = require('fs');

var app = express();
var server = http.createServer(app);
var socket = io.listen(server);

//to be updated everytime the user changes level, so not necessary a post for reset_code
var max_n_levels = 9;
//var username = null;
var username = 'ale';
var level = 1;

var levels_keys = ['level1', 'level-2', 'Level3', 'LEVEL4', 'LeVel5', 'level6', 'l-evel7', 'l8', 'L-e-v-e-l9'];
var levels_hash_keys = [];

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
	  extended: true
}));

app.use(bodyParser.json());
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

function
make_levels_keys() {
for(var i = 0; i < max_n_levels; i++) {
		levels_hash_keys.push(levels_keys[i]);
//		levels_hash_keys.push(crypto.createHash('md5').update(username+levels_keys[i]).digest("hex").substring(0,8););
	}
}

app.post('/login', function(req, res){
	console.log('body: ' + JSON.stringify(req.body));
	body = req.body;
	username = body.username;
	level_hash_key = body.level_hash_key;
	console.log(level_hash_key);
	make_levels_keys();

	if(level_hash_key !== "" && level_hash_key in levels_hash_keys) {
		level = levels_hash_keys.indexOf(level_hash_key) + 1;
	} else if(level_hash_key === ""){
		level = 1;
		res.send({ status: 'OK', 'redirect':'/index'});
	} else {
	res.send({ status: 'ERROR'});
	}
});

app.get('/reset_code', function(req, res){
	console.log("reset_code");
//  console.log('body: ' + JSON.stringify(req.body));
	code = return_level_code(level);
  if(code !== null) {
	res.send({ 'status': 'SUCCESS', 'body': code });
	} else {
		res.send({ 'status': 'ERROR', 'what': "file for level reset not found"});
	}
});



app.post('/get_level', function(req, res){
	make_levels_keys();
	console.log('body: ' + JSON.stringify(req.body));
	req_level = req.body.level;
	if(req_level != -1)
		level = req_level;
	dialogs = return_level_dialog(level);
	code = return_level_code(level);
	console.log(code);
	//collect keys to send
	tmp_keys = [];
	for(i = 0; i < level; i++) {
		tmp_keys.push(levels_hash_keys[i]);
		console.log(levels_hash_keys[i]);
	}
	if(code !== null) {
		res.send ({
			'status': 'SUCCESS',
			'body': code,
			'dialogs': dialogs,
			'level': level,
			'keys': tmp_keys
		});
	} else {
		res.send({ 'status': 'ERROR', 'what': "file for level not found"});
	}
});


app.post('/check_key', function(req, res){
	console.log('body: ' + JSON.stringify(req.body));

	hash_key = req.body.level_hash_key;

	lev = levels_hash_keys.indexOf(hash_key) + 1;
	if(lev === 0) {
		res.send({ 'status': 'ERROR', 'what': "key not found"});
	} else {
		res.send({ 'status': 'OK', 'level': lev});
	}
});

app.get('/', function(req, res){
	res.render('login');
	//res.render('index');
});

app.get('/index', function(req, res){
	res.render('index');
});

function
return_level_code(what) {
	code_level = null;
	code_level = fs.readFileSync( __dirname + '/public/levels/level'+what+'.js', 'utf8');
//	console.log(code_level);
	return code_level;

}

function
return_level_dialog(what) {
	dialogs = {};
	var obj = {};
	obj = JSON.parse(fs.readFileSync('public/static/dialog_level'+what+'.json', 'utf8'));
	/*
	dialogs['colonel'] = [];
	dialogs['assistant'] = [];
	dialogs['crazy_doctor'] = [];
	if('colonel' in obj) {
		if(what in obj['colonel']) {
			dialogs['colonel'] = obj['colonel'][what];
		}
	}
	if('assistant' in obj) {
		if(what in obj['assistant']) {
			dialogs['assistant'] = obj['assistant'][what];
		}
	}
	if('crazy_doctor' in obj) {
		if(what in obj['crazy_doctor']) {
			dialogs['crazy_doctor'] = obj['crazy_doctor'][what];
		}
	}
*/
	return obj;


}

app.listen(8000);
