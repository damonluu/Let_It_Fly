//Connect to mySQL database
var mysql = require('mysql');
var db_connection = require('./db_connection');
var CreditCard = require('credit-card');
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
//adding new user
module.exports.newUser = function(req, res) {
  console.log('POST New User');
  //getting the request json data
  var data = req.body; 
  console.log(data);

  db_connection.getConnection(function(err, c){
    if(err) throw err;
    //Add user info to the user table
     var queryInsert = 'INSERT INTO users(firstName, lastName, password, phoneNumber, email, rider)\
     VALUE ("' + data.firstname + '", "' + data.lastname + '", "' 
      + data.password + '", ' + data.phonenumber + ', "' + data.email + '", ' + data.rider + ')';
     console.log(queryInsert);
    c.query(queryInsert, function (err, result, fields){
        if (err) throw err;
        console.log(result.insertId);
        res.status(200).json(result.insertId);
        return res.end();
    });
  
  });

};

//GET USER
module.exports.getUser = function(req, res) {
  console.log('GET Existing User');
  //getting the request json data
  var data = req.query; 
  console.log(data);
  db_connection.getConnection(function(err, c){
    if(err) throw err;
     // var existAccount = false;
     // var queryExistAccount = 'SELECT ID FROM users WHERE email="' + data.email + '"';
     // console.log(queryExistAccount);
     // c.query(queryExistAccount, function(err, result, fields){
     //    if(err) throw err;
     //    else if(!Object.keys(result).length == 0){ console.log('Here'); existAccount = true; } 
     // });
     var query = 'SELECT ID FROM users WHERE email="' + data.email + '" and password="' + data.password + '"';
     console.log(query);
     c.query(query, function (err, result, fields){
        c.release();  
        if (result.length == 0) { return res.status(400).send('Invalid password or email'); }
        else {  res.status(200).json(data); return res.end(); }
      });
  });
};
