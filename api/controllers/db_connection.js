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
		c.query("CREATE TABLE IF NOT EXISTS Users (ID INT AUTO_INCREMENT, firstName VARCHAR(50) NOT NULL, lastName VARCHAR(50) NOT NULL ,password VARCHAR(50) NOT NULL, phoneNumber BIGINT NOT NULL, email VARCHAR(150), rider BOOLEAN NOT NULL, PRIMARY KEY (ID, email)) AUTO_INCREMENT=1000", function(err, result, fields){

    	//this is important to release the connection 
        if(err) throw err; 
        console.log(result);
                  
    	});
    	c.query("CREATE TABLE IF NOT EXISTS Payments(ID INT NOT NULL, type VARCHAR(100) NOT NULL, cardNum BIGINT, cvv INT, expMonth INT NOT NULL, expYear INT NOT NULL, name VARCHAR(100) NOT NULL, PRIMARY KEY (cardNum,cvv), FOREIGN KEY(ID) REFERENCES Users(ID))", function(err, result, fields){
    	//this is important to release the connection 
        if(err) throw err; 
        console.log(result);
                  
    	});
    	c.query("CREATE TABLE IF NOT EXISTS Drivers(id INT UNIQUE NOT NULL, current_long DOUBLE NOT NULL, current_lat DOUBLE NOT NULL, available BOOLEAN NOT NULL, FOREIGN KEY(ID) REFERENCES Users(ID))", function(err, result, fields){
    	//this is important to release the connection 
        if(err) throw err; 
        console.log(result);
                  
    	});
    	c.query("CREATE TABLE IF NOT EXISTS Rides(driverid INT, riderid INT, dest_long DOUBLE NOT NULL, dest_lat DOUBLE NOT NULL, start_long DOUBLE NOT NULL, start_lat DOUBLE NOT NULL, cost DOUBLE NOT NULL, carpool BOOLEAN NOT NULL, time DATETIME, PRIMARY KEY(driverid, riderid, time), FOREIGN KEY(driverid) REFERENCES DRIVERS(id), FOREIGN KEY (riderid) REFERENCES USERS(id))", function(err, result, fields){
    	//this is important to release the connection 
        if(err) throw err; 
        console.log(result);
                  
    	});
    	c.query("CREATE TABLE IF NOT EXISTS PastRides(driverid INT NOT NULL, riderid INT NOT NULL, dest_long DOUBLE NOT NULL, dest_lat DOUBLE NOT NULL, start_long DOUBLE NOT NULL, start_lat DOUBLE NOT NULL, cost DOUBLE NOT NULL, carpool BOOLEAN NOT NULL, time DATETIME, PRIMARY KEY(riderid, time), FOREIGN KEY (riderid) REFERENCES USERS(id))", function(err, result, fields){
    	//this is important to release the connection 
        if(err) throw err; 
        console.log(result);
                  
    	});
 	}	
 });

exports.getConnection = function (callback) {
      conPool.getConnection(callback);
};