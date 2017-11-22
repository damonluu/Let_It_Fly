//Connect to mySQL database
var mysql = require('mysql');
var db_connection = require('./db_connection');

// });
//adding new driver
module.exports.getPastRidesByDriverID = function(req, res) {
  if (req.query != null) {
    var data = req.query;
    console.log("Get Past Ride By ID: " + data.id);
    db_connection.getConnection(function(err, c) {
      var queryGetPastRide = 'SELECT * FROM PASTRIDES WHERE DRIVERID = ' + data.id;
      console.log(queryGetPastRide);
      c.query(queryGetPastRide, function(err, result, fields) {
        // c.release();
        if(result.length < 1) {
          return;
        }

        var queryGetDriverName = 'SELECT firstName, lastName FROM USERS WHERE ID = ' + data.id;
        c.query(queryGetDriverName, function(err, result2, fields) {
          // c.release();
          console.log("result2");
          console.log(result2);
          if(result2.length < 1) {
            return;
          }
          result[0].driverName = result2[0].firstName + " " + result2[0].lastName;
          console.log(result[0].driverName);

          var queryGetRiderName = 'SELECT firstName, lastName FROM USERS WHERE ID = ' + result[0].riderid;
          console.log("rider id");
          console.log(result[0]);
          console.log(result[0].riderid);
          c.query(queryGetRiderName, function(err, result3, fields) {
            c.release();
            console.log("result3");
            console.log(result3);
            if(result3.length < 1) {
              return;
            }
            result[0].riderName = result3[0].firstName + " " + result3[0].lastName;
            console.log(result[0].riderName);
            console.log("after result3");
            res.status(200).json(result);
            console.log("past ride controller ************");
            console.log("results");
            console.log(result);
            return res.end();
          });
        });
      });
    });
  }
};

module.exports.getPastRidesByRiderID = function(req, res) {
  if (req.query != null) {
    var data = req.query;
    console.log("Get Past Ride By ID: " + data.id);
    db_connection.getConnection(function(err, c) {
      var queryGetPastRide = 'SELECT * FROM PASTRIDES WHERE RIDERID = ' + data.id;
      console.log(queryGetPastRide);
      c.query(queryGetPastRide, function(err, result, fields) {
        // c.release();
        if(result.length < 1) {
          return;
        }
        var queryGetRiderName = 'SELECT firstName, lastName FROM USERS WHERE ID = ' + data.id;
        c.query(queryGetRiderName, function(err, result2, fields) {
          // c.release();
          console.log("result2");
          console.log(result2);
          if(result2.length < 1) {
            return;
          }
          result[0].riderName = result2[0].firstName + " " + result2[0].lastName;
          console.log(result[0].riderName);

          var queryGetDriverName = 'SELECT firstName, lastName FROM USERS WHERE ID = ' + result[0].driverid;
          console.log("driver id");
          console.log(result[0]);
          console.log(result[0].driverid);
          c.query(queryGetDriverName, function(err, result3, fields) {
            c.release();
            console.log("result3");
            console.log(result3);
            if(result3.length < 1) {
              return;
            }
            result[0].driverName = result3[0].firstName + " " + result3[0].lastName;
            console.log(result[0].driverName);
            console.log("after result3");
            res.status(200).json(result);
            console.log("past ride controller ************");
            console.log("results");
            console.log(result);
            return res.end();
          });
        });
      });
    });
  }
};
