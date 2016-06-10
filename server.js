var io   = require('socket.io'),
	url  = require('url'),
    express = require('express'),
    http=require('http');
var path = require('path');
var bodyParser = require('body-parser');

var fs = require('fs');

var app = express();
var server = http.createServer(app);
var socket = io.listen(server);


data = { "request": "paths_names",
		"day": "ciao"};
	data = JSON.stringify(data);
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
	  extended: true
}));

app.use(bodyParser.json());
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.get('/reset_code', function(req, res){
	console.log('body: ' + JSON.stringify(req.body));
	res.send({ status: 'SUCCESS' });
});

app.post('/send_code', function(req, res){
	console.log('body: ' + JSON.stringify(req.body));
	res.send({ status: 'SUCCESS' });
});

app.post('/get_level', function(req, res){
	console.log('body: ' + JSON.stringify(req.body));
	code = return_level_code(1);
	console.log(code);
	if(code !== null) {
	res.send({ 'status': 'SUCCESS', 'code': code });
	} else {
		res.send({ 'status': 'ERROR', 'what': "file for level not found"});
	}
});


app.get('/', function(req, res){
	res.render('index');
});

function
return_level_code(what) {
	level = null;
	level = fs.readFileSync( __dirname + '/public/levels/level1.js', 'utf8');
	console.log(level);
	return level;

}


app.listen(8000);
