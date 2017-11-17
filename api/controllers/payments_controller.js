var mysql = require('mysql');
var db_connection = require('./db_connection');
var CreditCard = require('credit-card');

module.exports.checkCard = function(req, res) {

    console.log("Validate Card");

    var data = req.body;
    console.log(data);
    var type = CreditCard.determineCardType(data.cardnumber);
    var card = {
      cardType: type,
      number: data.cardnumber,
      expiryMonth: data.month,
      expiryYear: data.year,
      cvv: data.cvv
    };
    var result = CreditCard.validate(card);
    console.log(result);
    if(!result.validCardNumber){ return res.status(400).send('Invalid Card Number'); }
    else if(result.isExpired) { return res.status(400).send('Card is expired'); }
    else if(!result.validCvv) { return res.status(400).send('Invalid CVV'); }
    else { 
    	db_connection.getConnection(function(err, c){
    		//Add the card info to the payment table - IN PROGRESS
		    var queryInsertPayment = 'INSERT INTO PAYMENTS\
		     VALUE (' + data.id + ', "' + type + '", "' + data.cardnumber + '", "' 
		      + data.cvv + '", ' + data.month + ', "' + data.year +  '", "' + data.cardholder + '")';
		    console.log(queryInsertPayment);
		    c.query(queryInsertPayment, function (err, result, fields){
		    	c.release(); 
		        if (err) throw err;
		        console.log(result);
		      });
    	});

    	res.status(200).send(data); return res.end(); 
    }
};

module.exports.getPaymentByID = function(req, res) {
    if(req.query != null){
      console.log("Get Payment By ID: " + data);
      var data = req.query;
      db_connection.getConnection(function(err, c){
          var queryGetPayment = 'SELECT * FROM PAYMENTS WHERE ID = ' + data.id;
          console.log(queryGetPayment);
          c.query(queryGetPayment, function (err, result, fields){
            c.release();  
            res.status(200).json(result); return res.end(); });
    });
    }
    
};
