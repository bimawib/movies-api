const express = require('express');
const route = express.Router();
const AuthControllers = require('../controllers/AuthController');
const AuthMiddleware = require('../middleware/AuthMiddleware');

route.post('/signup', AuthMiddleware.saveUser, AuthControllers.signUp)
route.post('/login', AuthControllers.login);

module.exports = route;