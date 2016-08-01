/*jshint -W069 */
var url  = require('url');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var crypto = require('crypto');
var session = require('client-sessions');
var fs = require('fs');
var app = express();
var max_n_levels = 9;
var default_level = 1;
var levels_keys = ['level1', 'level-2', 'Level3', 'LEVEL4', 'LeVel5', 'level6', 'l-evel7', 'l8', 'L-e-v-e-l9'];
var users = [];
var users_ttl = {};
var users_data = {};
var ttl = 30 * 60 * 1000;

app.set('trust proxy', true);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
	  extended: true
}));

app.use(session({
	cookieName: 'session',
	secret: 'g[isfd-8yF9-7w2315df{}+Ijsli;;to8',
	duration: ttl,
	activeDuration: ttl/2,
	httpOnly: true,
	ephemeral: true
}));

app.use(bodyParser.json());
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

server = app.listen(8000);

app.use(function(req, res, next) {

	if (req.session && req.session.user) {
		username = req.session.user;
		if (users.indexOf(username) > -1) {
			req.user = username;
			req.session.user = username;  //refresh the session value
			users_ttl[username] = new Date().getTime();
			res.locals.user = username;
		}
	}
	next();
});


app.post('/login', function(req, res){

	console.log('body: ' + JSON.stringify(req.body));
	body = req.body;
	username = body.username;
	level_hash_key = body.level_hash_key;

	levels_hash_keys = make_levels_keys(username, false);
	//if a session is valid and username is already stored
	if(req.session.user == username && users.indexOf(username) > -1) {
		//if user has inserted a level key
		if(level_hash_key !== "" && levels_hash_keys.indexOf(level_hash_key) > -1) {
			level = levels_hash_keys.indexOf(level_hash_key) + 1;
		} else { //restore game from level in memory
			level = users_data['level'];
		}
		initialize_user(req, level); //save user data in memory
		res.send({ status: 'OK', 'redirect':'/index', 'level': level});

	//if there is already this username in memory but not the session, someone else is using the same username
	} else if(users.indexOf(username) > -1 ) {
		console.log("error");
		res.send({ status: 'ERROR', 'what':'Username already used. Please try another one.' });
	} else {
		//if user has inserted a level key
		if(level_hash_key !== "" && levels_hash_keys.indexOf(level_hash_key) > -1) {
			level = levels_hash_keys.indexOf(level_hash_key) + 1;
			initialize_user(req, level);
			res.send({ status: 'OK', 'redirect':'/index', 'level': level});

		} else if(level_hash_key === ""){
			level = 1;
			initialize_user(req, level);
			res.send({ status: 'OK', 'redirect':'/index', 'level': level});
		} else {
			res.send({ status: 'ERROR', 'what':'Level code is wrong. Please try another one.' });
		}
	}
});

app.post('/score', function(req, res){
	console.log('body: ' + JSON.stringify(req.body));
	username = req.session.user;
	body = req.body;
	body['level'] = users_data[username]['level'];
	users_data[username]['score'] = body;
	console.log('body: ' + JSON.stringify(body));

	res.send({ status: 'OK', 'redirect':'/score'});
});

app.get('/logout', function(req, res) {
	username = req.session.user;
	index = users.indexOf(username);
	if (index > -1) {
		users.splice(index, 1);
		delete users_ttl[username];
		delete users_data[username];

	}
	req.session.reset();
	res.send({ status: 'OK', 'redirect':'/'});
});

app.get('/get_score', function(req, res){
	res.send(users_data[req.session.user]['score']);
	//score = {"levels_completed":[3, 4, 5, 9],"total_time":"1 m 23 s","avg_time":"0 m 2 s","totalMissilesUsed":53,"username":"ale","level":9};
	//res.send(score);
});

app.get('/reset_code', function(req, res){
	console.log('level: '+ level);
	console.log("reset_code");
	username = req.session.user;

	code = return_level_code(users_data[username]['level']);
	if(code !== null) {
		res.send({ 'status': 'SUCCESS', 'body': code });
	} else {
		res.send({ 'status': 'ERROR', 'what': "file for level reset not found"});
	}
});



app.post('/get_level', function(req, res){

	console.log('body: ' + JSON.stringify(req.body));
	req_level = parseInt(req.body.level);
	//if user is not requiring a specific level..
	if(req_level != -1)
		level = req_level;
	else
		level = default_level;
	username = req.session.user;
	users_data['level'] = level;
	index = users.indexOf(username);
	if (index > -1 || req_level == -1) {
		dialogues = return_level_dialog(level);
		code = return_level_code(level);
		//collect keys to send
		tmp_keys = [];
		for(i = 0; i < level; i++) {
			tmp_keys.push(levels_hash_keys[i]);
		}
		if(code !== null) {
			res.send ({
				'status': 'SUCCESS',
				'username': req.session.user,
				'body': code,
				'dialogues': dialogues,
				'level': level,
				'keys': tmp_keys
			});
		} else {
			res.send({ 'status': 'ERROR', 'what': "file for level not found"});
		}
	} else {
		res.send({ 'status': 'ERROR', 'what': "Session expired", 'redirect': '/session'});
	}
});


app.post('/check_key', function(req, res){
	console.log('body: ' + JSON.stringify(req.body));
	username = req.session.user;
	hash_key = req.body.level_hash_key;

	lev = users_data[username]['levels_hash_keys'].indexOf(hash_key) + 1;
	if(lev === 0) {
		res.send({ 'status': 'ERROR', 'what': "key not found"});

	} else {
		res.send({ 'status': 'OK', 'level': lev});
	}
});

app.get('/', function(req, res){
	res.render('login');
});
app.get('/session', function(req, res){
	res.render('session');
});

app.get('/score', requireLogin, function(req, res){
	res.render('score');
});

app.get('/index',  requireLogin, function(req, res){

	l = req.query.l;
	username = req.session.user;
	l = users_data[username]['levels_hash_keys'].indexOf(l) + 1;

	if(l !== undefined && parseInt(l) > 0) {
		users_data[username]['level'] = l;
		console.log(users_data[username]['level']);
	}
	res.render('index');
});

//catch bad request
app.get('*', function(req, res) {
	res.status(404);
	if (req.accepts('html')) {
		res.render('404', { url: req.url });
		return;
	}
});

function
requireLogin (req, res, next) {
	if (!req.user) {
		res.redirect('/session');
	} else {

		next();
	}
}

//create custom user keys
function
make_levels_keys(who, store) {
	levels_hash_keys = [];
	for(var i = 0; i < max_n_levels; i++) {

		levels_hash_keys.push(crypto.createHash('md5').update(who+levels_keys[i]).digest("hex").substring(0,8));
	}
	if(store) {
		users_data[who]['levels_hash_keys'] = levels_hash_keys;
	} else {
		console.log(levels_hash_keys);
		return levels_hash_keys;
	}
}

//store user data when user login
function
initialize_user(req, level) {

	req.session.user = username;
	if(users.indexOf(username) == -1)
		users.push(username);
	users_ttl[username] = new Date().getTime();
	users_data[username] = {};
	users_data[username]['level'] = default_level;
	make_levels_keys(username, true);
	users_data[username]['score'] = {};

}

//read level from file
function
return_level_code(what) {
	code_level = null;
	code_level = fs.readFileSync( __dirname + '/public/levels/level'+what+'.js', 'utf8');
	return code_level;

}

//read dialogues from file
function
return_level_dialog(what) {
	dialogues = {};
	var obj = {};
	obj = JSON.parse(fs.readFileSync('public/static/dialog_level'+what+'.json', 'utf8'));
	return obj;
}

//check if some session is expired and delete data
setInterval(function() {
	console.log("Current users: "+users);
	for(var key in users_ttl) {
		if(new Date().getTime() - users_ttl[key] > ttl){
			index = users.indexOf(key);
			if (index > -1) {
				users.splice(index, 1);
				delete users_ttl[key];
				delete users_data[key];

			}
		}

	}
}, 10000);

