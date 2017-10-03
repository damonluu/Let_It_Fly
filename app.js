var express = require('express');
var http = require('http');
var app = express();
var path = require('path');
var routes = require('./routes');
//Connect to mySQL database
var mysql = require('mysql');
var con = mysql.createConnection({
	host: "localhost",
	user: "root",
	password: "fakepass",
	database: "user"
});

con.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
})

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
