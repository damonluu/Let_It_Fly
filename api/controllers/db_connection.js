//Connect to mySQL database
var mysql = require('mysql');
var con = mysql.createPool({
	host: "localhost",
	user: "development",
	password: "random",
	database: "app_db"
});

	con.getConnection(function(err, c) {
		if (err) throw err;
			//create database for the application
		c.query("CREATE DATABASE IF NOT EXISTS app_db", function(err, result){
			if(err) throw err;
			console.log("DATABASE created");

		});
		console.log("Connected!");

		c.query("USE app_db", function(err, result){
			if(err) throw err;
			console.log("DATABASE selected");
		});

		c.release;
	});



exports.getConnection = function (callback) {
      con.getConnection(callback);
  };