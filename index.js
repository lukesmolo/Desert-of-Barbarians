var io   = require('socket.io'),
	url  = require('url'),
    express = require('express'),
    http=require('http');
var path = require('path');


var app = express();
var server = http.createServer(app);
var socket = io.listen(server);

app.use(express.static(path.join(__dirname, 'public')));
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');

app.get('/', function(req, res){
	res.render('index');
});

app.listen(8000);
