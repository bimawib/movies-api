var express = require('express');
var route = express.Router();
var UsersController = require('../controllers/UsersController');


route.get('/', UsersController.get);

module.exports = route;