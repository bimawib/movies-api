var express = require('express');
var route = express.Router();
var MoviesController = require('../controllers/MoviesController');
const AuthMiddleware = require('../middleware/AuthMiddleware');
const fileUpload = require('../middleware/MulterMiddleware');

route.get('/', AuthMiddleware.authenticate, MoviesController.get);
route.get('/:id', AuthMiddleware.authenticate, MoviesController.getById);
route.post('/', AuthMiddleware.authenticate, fileUpload.single('picture_link'), MoviesController.create);
route.put('/:id', AuthMiddleware.authenticate, fileUpload.single('picture_link'), MoviesController.update);
route.delete('/:id', AuthMiddleware.authenticate, MoviesController.delete);

module.exports = route;