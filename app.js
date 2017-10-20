var express = require('express');
var http = require('http');
var app = express();
var path = require('path');

var routes = require('./api/routes');

var bodyParser = require('body-parser');
app.use(bodyParser.json());


//Connect to mySQL databasIe
var mysql = require('mysql');
var con = mysql.createConnection({
	host: "localhost",
	user: "development",
	password: "random"});

con.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");

	//create database for the application
	con.query("CREATE DATABASE IF NOT EXISTS app_db", function(err, result){
		if(err) throw err;
		console.log("DATABASE created");
	})
});


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
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

http.createServer(app).listen(app.get('port'), serverListener);



