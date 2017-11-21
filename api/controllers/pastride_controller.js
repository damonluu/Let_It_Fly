// //Connect to mySQL database
// var mysql = require('mysql');
// var db_connection = require('./db_connection');

// // });
// //adding new driver
// module.exports.getPastRidesByDriverID = function(req, res) {
//   if (req.query != null) {
//     console.log("Get Past Ride By ID: " + data);
//     var data = req.query;
//     db_connection.getConnection(function(err, c) {
//       var queryGetPastRide = 'SELECT * FROM PASTRIDES WHERE DRIVERID = ' + data.id;
//       console.log(queryGetPastRide);
//       c.query(queryGetPastRide, function(err, result, fields) {
//         c.release();
//         res.status(200).json(result);
//         return res.end();
//       });
//     });
//   }
// };

// module.exports.getPastRidesByRiderID = function(req, res) {
//   if (req.query != null) {
//     console.log("Get Past Ride By ID: " + data);
//     var data = req.query;
//     db_connection.getConnection(function(err, c) {
//       var queryGetPastRide = 'SELECT * FROM PASTRIDES WHERE RIDERID = ' + data.id;
//       console.log(queryGetPastRide);
//       c.query(queryGetPastRide, function(err, result, fields) {
//         c.release();
//         res.status(200).json(result);
//         return res.end();
//       });
//     });
//   }

// };