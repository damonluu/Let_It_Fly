//Connect to mySQL database
var mysql = require('mysql');
var db_connection = require('./db_connection');

// });
//adding new driver
module.exports.activateDriver = function(req, res) {
  console.log('POST New Driver');
  //getting the request json data
  var data = req.body;
  console.log(data);

  db_connection.getConnection(function(err, c){
    if(err) throw err;
    //Add user info to the user table
    //, available BOOLEAN NOT NULL, FOREIGN KEY(ID) REFERENCES Users(ID))", function(err, result, fields){
     var queryInsert = 'INSERT INTO Drivers VALUE (' + data.id + ', ' + data.long + ', ' + data.lat + ', ' + data.available + ')';
     console.log(queryInsert);
    c.query(queryInsert, function (err, result, fields){
        if (err) throw err;
        c.release();
        console.log(result);
        res.status(200).json(result);
        return res.end();
    });

  });

};

// //GET USER
// module.exports.getUser = function(req, res) {
//   console.log('GET Existing User');
//   //getting the request json data
//   var data = req.query;
//   console.log(data);
//   db_connection.getConnection(function(err, c){
//     if(err) throw err;
//      // var existAccount = false;
//      // var queryExistAccount = 'SELECT ID FROM users WHERE email="' + data.email + '"';
//      // console.log(queryExistAccount);
//      // c.query(queryExistAccount, function(err, result, fields){
//      //    if(err) throw err;
//      //    else if(!Object.keys(result).length == 0){ console.log('Here'); existAccount = true; }
//      // });
//      var query = 'SELECT ID FROM users WHERE email="' + data.email + '" and password="' + data.password + '"';
//      console.log(query);
//      c.query(query, function (err, result, fields){
//         c.release();
//         if (result.length == 0) { return res.status(400).send('Invalid password or email'); }
//         else {  res.status(200).json(result); return res.end(); }
//       });
//   });
// };
