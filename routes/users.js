var express = require('express');
var router = express.Router();
var UsersController = require('../controllers/UsersController');


router.get('/', UsersController.get);

module.exports = router;