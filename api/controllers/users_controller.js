//Connect to mySQL database
var mysql = require('mysql');
var con = mysql.createConnection({
  host: "localhost",
  user: "development",
  password: "random",
  database: "app_db"});

con.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");

  //create database for the application
  con.query("CREATE TABLE IF NOT EXISTS users (firstName VARCHAR(50), lastName VARCHAR(50),\
    password VARCHAR(50), phoneNumber BIGINT, email VARCHAR(150),\
    PRIMARY KEY (email))", function(err, result){
    if(err) throw err;
    console.log("DATABASE created");
  })
});

//adding new user
module.exports.newUser = function(req, res) {
  console.log('POST newUser');
  //getting the request json data
  var data = req.body; 
  console.log(data);
  var query = 'INSERT INTO users(firstName, lastName, password, phoneNumber, email)\
    VALUE ("' + data.firstName + '", "' + data.lastName + '", "' 
    + data.password + '", ' + data.phoneNumber + ', "' + data.email + '")';
  console.log(query);
  con.query(query);
  res
    .status(200)
    .json(data);
  res.end();
};

