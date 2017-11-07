//Connect to mySQL database
var mysql = require('mysql');
var db_connection = require('./db_connection');
var CreditCard = require('credit-card');

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
    
     var query = 'SELECT ID, firstName, lastName FROM users WHERE email="' + data.email + '" and password="' + data.password + '"';
     console.log(query);
     c.query(query, function (err, result, fields){
        c.release();  
        if (result.length == 0) { return res.status(400).send('Invalid password or email'); }

        else {  
          console.log(result);
          res.status(200).json(result); 
          return res.end(); 
        }

      });

  });
};
