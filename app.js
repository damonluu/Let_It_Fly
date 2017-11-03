var express = require('express');
var http = require('http');
var app = express();
var path = require('path');

var routes = require('./api/routes');
var db_connection = require('./api/controllers/db_connection');

var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next(); 
});

//define the port to host the server
app.set('port', 1600);

//middleware to console log every request
var serverListener = function (req, res){
	console.log('Express server listening on port ' + app.get('port'));
};

//set static directory before defining route
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public', {
  extensions: ['html']
}));

app.use(routes);

http.createServer(app).listen(app.get('port'), serverListener);
