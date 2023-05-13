var express = require('express');
var route = express.Router();
var MoviesController = require('../controllers/MoviesController');
const AuthMiddleware = require('../middleware/auth');

route.get('/', AuthMiddleware.authenticate, MoviesController.get);
route.get('/:id', AuthMiddleware.authenticate, MoviesController.getById);
route.post('/', AuthMiddleware.authenticate, MoviesController.create);
route.put('/:id', AuthMiddleware.authenticate, MoviesController.update);
route.delete('/:id', AuthMiddleware.authenticate, MoviesController.delete);

module.exports = route;