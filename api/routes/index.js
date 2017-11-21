var express = require('express');
var router = express.Router();

var ctrlUser = require('../controllers/users_controller.js');
var ctrlPayment = require('../controllers/payments_controller.js');
var ctrlDriver = require('../controllers/driver_controller.js');
var ctrlPastRides = require('../controllers/pastride_controller.js');
router
  .route('/user')
  .post(ctrlUser.newUser)
  .get(ctrlUser.getUser);

router
  .route('/checkCard')
  .post(ctrlPayment.checkCard);

router
  .route('/activateDriver')
  .post(ctrlDriver.activateDriver);

router
  .route('/getID')
  .get(ctrlUser.getUserByID);

router
  .route('/getPayment')
  .get(ctrlPayment.getPaymentByID);

// router
//   .route('/getPastridesDriver')
//   .get(ctrlPastRides.getPastRidesByDriverID);

// router
//   .route('/getPastridesRider')
//   .get(ctrlPastRides.getPastRidesByRiderID);

module.exports = router;
