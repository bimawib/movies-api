const MovieService = require('../services/MovieService');
const { Movies } = require('../models');

const MoviesController = {

    async get(req, res, next){
        try{
            const { page, limit } = req.query;
            const movies = await MovieService.getMoviesIndex(page, limit);
            res.status(200).json(movies);
        } catch(error) {
            res.status(500).json({
                error: error.message
            });
        }
    },

    async getById (req, res, next){ 
        try {
            const { id } = req.params;
            const movie = await MovieService.getMovieById(id);

            if(!movie){
                return res.status(404).json({
                    error: 'Movie not found'
                });
            }
            return res.json(movie);
        } catch (error) {
            return res.status(500).json({
                error: error.message
            });
        }
    },

    async create(req, res, next){
        try {
            const file = req.file;
            const { title, genres, year } = req.body;
            const field = {
                title,
                genres,
                year,
                file
            };

            const createdMovies = await MovieService.createMovie(field);
            res.status(201).json({data: createdMovies});
        } catch (error){
            res.status(500).json({ 
                error: error.message
            });
        }
    },

    async update(req, res, next){
        try {
            const movieId = req.params.id;
            const file = req.file;
            const { title, genres, year } = req.body;
            const field = {
                title,
                genres,
                year,
                file
            };

            const updatedMovie = await MovieService.updateMovie(movieId, field);
            res.json(updatedMovie);
        } catch (error){
            res.status(500).json({
                error: error.message
            });
        }
    },
    
    async delete(req, res) {
        try {
            const { id } = req.params;
            const deletedMovie = await MovieService.deleteMovie(id);
            if (!deletedMovie) {
                return res.status(404).json({ error: 'Movie not found' });
            }
            res.json(deletedMovie);
        } catch (error) {
            console.error(error);
            return res.status(500).json(error);
        }
    },
}

module.exports = MoviesController;