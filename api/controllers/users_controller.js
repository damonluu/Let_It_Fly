

module.exports.newUser = function(req, res) {
  console.log('GET the hotels');
  res
    .status(200)
    .json(hotelData);
};

//get a hotel with a specific id(index) dynamicly
module.exports.hotelsGetOne = function(req, res) {
	//getting the request json data
  var data = req.body;
  res
    .status(200)
    .json(data);
	
};