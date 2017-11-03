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

db_connection.getConnection(function (err, c) { 
    if (err) throw err;

    // Use c as a connection 
     c.query("CREATE TABLE IF NOT EXISTS users (ID INT UNIQUE AUTO_INCREMENT, firstName VARCHAR(50), lastName VARCHAR(50),\
    password VARCHAR(50), phoneNumber BIGINT, email VARCHAR(150),\
    PRIMARY KEY (email)) AUTO_INCREMENT=1000", function(err, result, fields){
    //this is important to release the connection 
        if(err) throw err; 
        console.log(result);
                  
    });
    c.query("CREATE TABLE IF NOT EXISTS payments (ID INT NOT NULL, cardNum BIGINT, cvv INT, expMonth INT, expYear INT, name VARCHAR(100), PRIMARY KEY (cardNum,cvv), FOREIGN KEY(ID) REFERENCES Users(ID))", function(err, result, fields){
    //this is important to release the connection 
        c.release();
        if(err) throw err; 
        console.log(result);
                  
    });
});

//adding new user
module.exports.newUser = function(req, res) {
  console.log('POST New User');
  //getting the request json data
  var data = req.body; 
  console.log(data);

  db_connection.getConnection(function(err, c){
    if(err) throw err;
    //Add user info to the user table
     var queryInsert = 'INSERT INTO users(firstName, lastName, password, phoneNumber, email)\
     VALUE ("' + data.firstname + '", "' + data.lastname + '", "' 
      + data.password + '", ' + data.phonenumber + ', "' + data.email + '")';
     console.log(queryInsert);
    c.query(queryInsert, function (err, result, fields){
        if (err) throw err;
        console.log(result);
      });
    //Get the id of users from the user table - IN PROGRESS
    // var insertID; 
    // var querySelect = 'SELECT ID FROM USERS WHERE EMAIL = "' + data.email + '"';
    // console.log(querySelect);
    // c.query(querySelect, function (err, result, fields){
    //     if (err) throw err;
    //     console.log(result[0].id);
    //     insertID = result[0].id;
    //     console.log(insertID);
    // });
    //Add the card info to the payment table - IN PROGRESS
    // var queryInsertPayment = 'INSERT INTO PAYMENTS\
    //  VALUE ("' + insertID + '", "' + data.cardnumber + '", "' 
    //   + data.cvv + '", ' + data.month + ', "' + data.year +  '", "' + data.cardholder + '")';
    //  console.log(queryInsertPayment);
    // c.query(queryInsertPayment, function (err, result, fields){
    //     if (err) throw err;
    //     console.log(result);
    //   });

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
        if (Object.keys(result).length == 0) { return res.status(400).send('Invalid password or email'); }
        else {  res.status(200).json(data); res.end(); }
      });
  });
};

module.exports.checkCard = function(req, res) {

    console.log("Validate Card");

    var data = req.body;
    console.log(data);
    var type = CreditCard.determineCardType(data.cardNumber);
    var card = {
      cardType: type,
      number: data.cardNumber,
      expiryMonth: data.month,
      expiryYear: data.year,
      cvv: data.cvv
    };
    var result = CreditCard.validate(card);
    console.log(result);
    if(!result.validCardNumber){ return res.status(400).send('Invalid Card Number'); }
    else if(result.isExpired) { return res.status(400).send('Card is expired'); }
    else if(!result.validCvv) { return res.status(400).send('Invalid CVV'); }
    else { res.status(200).send(data); return res.end(); }
};