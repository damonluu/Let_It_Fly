var express = require('express');
var http = require('http');
var app = express();
var path = require('path');
var db_connection = require('./api/controllers/db_connection');

var routes = require('./api/routes');
var db_connection = require('./api/controllers/db_connection');

var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(function(req, res, next) {
  console.log(req.method, req.url);
  next();
});

//define the port to host the server
app.set('port', 1600);

//middleware to console log every request
var serverListener = function (req, res){
	console.log('Express server listening on port ' + app.get('port'));
};

//set static directory before defining route
// app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname + '/public', {
  extensions: ['html']
}));

app.use(routes);

var server = http.createServer(app).listen(app.get('port'), serverListener);



//setting up google map api
var googleMapsClient = require('@google/maps').createClient({
  key: 'AIzaSyDNIMuefOw8IFBBjGifWHAMMuSKOC7epj0'
});

googleMapsClient.distanceMatrix({
  origins:[{lat:37.3352,lng:-121.8811}],
  destinations:[{lat: 37.4323, lng:-121.8996}]
}, function(err, response) {
  if (!err) {
  	console.log(response.json.rows[0].elements[0].distance.value);

  }
});



var io = require('socket.io')(server);
//handling events happen on socket.io
io.on('connection', function(socket){
  console.log('a client has connected');
	//return the location of all active driver when the client emit 'map view'
	socket.on('rider view', function(data){
		db_connection.getConnection(function(err, c){
			c.query('SELECT * FROM Drivers', function(err, result, feilds){
				if(err) throw err;
				console.log(result);
				io.emit('map view', result);
				
			});
		});
	});

	//data should contain: driver id, current long, current lat
	socket.on('new driver', function(data){
		console.log('new driver available');
    	console.log(data);
		db_connection.getConnection(function(err, c){
      	var queryInsert = 'INSERT INTO Drivers VALUE (' + data.id + ', ' + data.long + ', ' + data.lat + ', ' + data.available + ')';
			c.query(queryInsert,  function(err, result, feilds){
				if(err) throw err;
				io.emit("update map");
				console.log(result);
			});
		});
	});

	//data for request ride: driver id, rider id, dest long, dest lat, start long, start lat, cost, carpool, time
	//Add the first rider
	socket.on('ride request', function(data){
		db_connection.getConnection(function(err, c){
			var queryInsertRide = 'INSERT INTO Rides VALUE (' + data.driverID + ', ' + data.riderID + ', ' + data.destinationLat + ', ' + data.destinationLng + ', ' + data.riderLat + ', ' + data.riderLng + ', ' + data.cost + ', ' + data.carpool +', ' + data.duration + ')';
			console.log(queryInsertRide);
			c.query(queryInsertRide,  function(err, result, feilds){
				if(err) throw err;
				console.log(result);
			});
		});
		console.log('notifying the driver');
		io.emit("new rider", data);
	});

	//Remove the driver on both views once the driver clicks ride completed
	socket.on('remove driver', function(data){
		db_connection.getConnection(function(err, c){
			var queryRemove = 'DELETE FROM RIDES WHERE driverID = ' + data.id ; 
			c.query(queryRemove,  function(err, result, feilds){
				if(err) throw err;
				console.log(result);
				console.log('notifying the rider');
				io.emit("ride completed",result);
			});
		});
		
	});

//data: riderId, rider-lat, rider-long, dest-lat, dest-long
	socket.on('active rides', function(data){
		db_connection.getConnection(function(err, c){
			c.query("SELECT * FROM Rides", function(err, result, feilds){
				if(err) throw err;
				console.log(result);
				if(result.RowDataPacket == null){
					console.log("no active ride");
					io.emit('find nearest', data);
				} else{
					console.log("look for carpool");
					io.emit('search carpool', result);
				}
			})
		});
	});

	// //Add the second rider
	// socket.on('add carpool', function(data){
	// 	db_connection.getConnection(function(err, c){
	// 		//Add the second rider
	// 		var queryInsertCarpool = 'INSERT INTO Rides VALUE (' + data.driverID + ', ' + data.riderID + ', ' + data.destinationLat + ', ' + data.destinationLng + ', ' + data.riderLat + ', ' + data.riderLng + ', ' + data.price + ', TRUE, ' + data.duration + ')';
	// 		c.query(queryInsertCarpool,  function(err, result, feilds){
	// 				if(err) throw err;
	// 				console.log(result);
	// 		});
	// 		//Alter the first rider's carpool to true
	// 		var queryUpdate = 'UPDATE RIDES SET CARPOOL = TRUE WHERE DRIVERID = ' + data.driverID;
	// 		c.query(queryAlter,  function(err, result, feilds){
	// 				if(err) throw err;
	// 				console.log(result);
	// 		});
	// 	});
	// 	//Notify the driver that the second rider is added to the queue
	// 	console.log('notifying the driver');
	// 	io.emit("new rider", data);
	// });

});
