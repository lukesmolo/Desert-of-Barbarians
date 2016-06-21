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

//to be update everytime the user changes level, so not necessary a post for reset_code
var level = 1;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({
	  extended: true
}));

app.use(bodyParser.json());
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

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

app.post('/send_code', function(req, res){
	console.log('body: ' + JSON.stringify(req.body));
	body = req.body;
	level_code = body.body;
	level_n = body.level;
	testFunction = new Function(level_code);
	testFunction();
	console.log(level_code);
	res.send({ status: 'SUCCESS'});
});

app.post('/get_level', function(req, res){
	console.log('body: ' + JSON.stringify(req.body));
	code = return_level_code(req.body.level);
	console.log(code);
	if(code !== null) {
	res.send({ 'status': 'SUCCESS', 'body': code });
	} else {
		res.send({ 'status': 'ERROR', 'what': "file for level not found"});
	}
});


app.get('/', function(req, res){
	res.render('index');
});

function
return_level_code(what) {
	code_level = null;
	code_level = fs.readFileSync( __dirname + '/public/levels/level'+what+'.js', 'utf8');
//	console.log(code_level);
	return code_level;

}


app.listen(8000);
