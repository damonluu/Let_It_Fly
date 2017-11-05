//Connect to mySQL database
var mysql = require('mysql');
var db_connection = require('./db_connection');
<<<<<<< Updated upstream
// var con = mysql.createConnection({
//   host: "localhost",
//   user: "development",
//   password: "random",
//   database: "app_db"});

// var con = db_connection.getConnection (function(err, c){
//   if (err) throw err;
//   console.log("Connected!");

//   //create database for the application
//   c.query("CREATE TABLE IF NOT EXISTS users (ID INT UNIQUE AUTO_INCREMENT, firstName VARCHAR(50), lastName VARCHAR(50),\
//     password VARCHAR(50), phoneNumber BIGINT, email VARCHAR(150),\
//     PRIMARY KEY (email)) AUTO_INCREMENT=1000", function(err, result){
//     if(err) throw err;
//     console.log("DATABASE created");
//   });

// });

db_connection.getConnection(function (err, c) { 
    if (err) throw err;

    // Use c as a connection 
     c.query("CREATE TABLE IF NOT EXISTS users (ID INT UNIQUE AUTO_INCREMENT, firstName VARCHAR(50), lastName VARCHAR(50),\
    password VARCHAR(50), phoneNumber BIGINT, email VARCHAR(150),\
    PRIMARY KEY (email)) AUTO_INCREMENT=1000", function(err, result, fields){

    //this is important to release the connection 
        c.release();
        if(err) throw err; 
        console.log(result);
                  
    });

});

=======
var CreditCard = require('credit-card');

>>>>>>> Stashed changes
//adding new user
module.exports.newUser = function(req, res) {
  console.log('POST New User');
  //getting the request json data
  var data = req.body; 
  console.log(data);

  db_connection.getConnection(function(err, c){
    if(err) throw err;
     var query = 'INSERT INTO users(firstName, lastName, password, phoneNumber, email)\
     VALUE ("' + data.firstName + '", "' + data.lastName + '", "' 
      + data.password + '", ' + data.phoneNumber + ', "' + data.email + '")';

      console.log(query);
      
      c.query(query, function (err, result, fields){
        
        c.release();  

        if (err) throw err;
        console.log(result);
      });

  });
  res
    .status(200)
    .json(data);
  res.end();
};

//GET USER
module.exports.getUser = function(req, res) {
  console.log('GET Existing User');
  //getting the request json data
  var data = req.query; 
  console.log(data);


  db_connection.getConnection(function(err, c){
    if(err) throw err;
    
     var query = 'SELECT ID, firstName, lastName FROM users WHERE email="' + data.email + '" and password="' + data.password + '"';
     console.log(query);
     c.query(query, function (err, result, fields){
        c.release();  
<<<<<<< Updated upstream
        if (Object.keys(result).length == 0) { return res.status(401).json({error: 'Invalid password or email'}); }
        else {  res.status(200).json(data); res.end(); }
=======
        if (result.length == 0) { return res.status(400).send('Invalid password or email'); }
        else {  
          console.log(result);
          res.status(200).json(result); 
          return res.end(); 
        }
>>>>>>> Stashed changes
      });

  });
};