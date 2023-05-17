var express = require('express');
var route = express.Router();
var UsersController = require('../controllers/UsersController');
const AuthMiddleware = require('../middleware/AuthMiddleware');
const fileUpload = require('../middleware/MulterMiddleware');

route.get('/', AuthMiddleware.authenticate, UsersController.get);

route.get('/:id', AuthMiddleware.authenticate, UsersController.getById);

route.put('/:id', AuthMiddleware.authenticate, fileUpload.single('avatar'), UsersController.update);

route.delete('/:id', AuthMiddleware.authenticate, UsersController.delete);

module.exports = route;