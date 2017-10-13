var express = require('express');
var router = express.Router();

var ctrlUser = require('../controllers/users_controller.js');

router
  .route('/user')
  .post(ctrlUser.newUser);

module.exports = router;