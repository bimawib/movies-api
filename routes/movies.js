var express = require('express');
var router = express.Router();
var MoviesController = require('../controllers/MoviesController');

router.get('/', MoviesController.get);

module.exports = router;