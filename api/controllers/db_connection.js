//Connect to mySQL database
var mysql = require('mysql');

var conPool = mysql.createPool({
	host: "localhost",
	user: "development",
	password: "random",
	database: 'app_db'
});

conPool.getConnection(function(err, c) {
 	if(err) throw err;
 	else {
 		c.query('USE app_db',function(err, result){
			if(err) throw err;
			console.log("Connected to app_db");
		});
 	}	
 });

exports.getConnection = function (callback) {
      conPool.getConnection(callback);
};