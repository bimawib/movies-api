var express = require('express');
var route = express.Router();
var MoviesController = require('../controllers/MoviesController');

route.get('/', MoviesController.get);
route.get('/:id', MoviesController.getById);
route.post('/', MoviesController.create);
route.put('/:id', MoviesController.update);
route.delete('/:id', MoviesController.delete);

module.exports = route;