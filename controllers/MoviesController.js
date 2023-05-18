let client;
const path = require('path');
const { Movies } = require('../models');
const Validator = require('fastest-validator');
const validationChecker = new Validator();
const APP_HOSTNAME = process.env.APP_HOSTNAME;

const MoviesController = {
    setClient(dbClient) {
        client = dbClient;
    },

    async get(req, res, next){
        try{
            const page = parseInt(req.query.page) || 1;
            let limit = parseInt(req.query.limit) || 10;
            const offset = (page - 1) * limit;

            // Validate and limit the maximum value of 'limit' if needed
            if (limit > 100) {
                limit = 100; // Set a maximum limit of 100
            }

            const result = await client.query('SELECT * FROM movies OFFSET $1 LIMIT $2', [offset, limit]);

            const getMovies = result.rows;
            res.json(getMovies);
        } catch(error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async getById (req, res){
        const { id } = req.params;
      
        try {
          const movie = await Movies.findByPk(id);
          if (!movie) {
            return res.status(404).json({ error: 'Movie not found' });
          }
          return res.json(movie);
        } catch (error) {
          console.error(error);
          return res.status(500).json({ error: 'Server error' });
        }
    },

    async create(req, res, next){
        const validate = validationChecker.validate(req.body, movieValidation);
        if(validate.length){
            return res.status(400).json(validate);
        }

        const {
            title,
            genres,
            year
        } = req.body;

        try {
            const createdMovies = await Movies.create({
                title,
                genres,
                year
            });

            // const createdMovies = result.rows[0];
            res.status(201).json({data: createdMovies});
        } catch (error){
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },

    async update(req, res, next){
        const movieId = req.params.id;

        let absoluteFilePath = req.file;
        let relativeFilePath;
        let fileLink;

        if(absoluteFilePath !== undefined){
            absoluteFilePath = req.file.path;
            relativeFilePath = path.relative(process.cwd(), absoluteFilePath);
            fileLink = relativeFilePath.replace(/\\/g, '/');
        }

        const validate = validationChecker.validate(req.body, movieValidation);
        if(validate.length){
            return res.status(400).json(validate);
        }

        const fieldValue =  {
            title: req.body.title,
            genres: req.body.genres,
            year: req.body.year,
            ...(fileLink !== undefined && { picture_link: APP_HOSTNAME + fileLink })
        };

        try {
            const updatedMovies = await Movies.update(fieldValue, {
                where: {id: movieId}
            });

            const updatedMovie = await Movies.findByPk(movieId);
            res.json(updatedMovie);
        } catch (error){
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    },
    
    async delete(req, res) {
        const { id } = req.params;
      
        try {
            // Find the movie by ID
            const movie = await Movies.findByPk(id);
        
            // Check if the movie exists
            if (!movie) {
                return res.status(404).json({ error: 'Movie not found' });
            }
        
            // Delete the movie
            await movie.destroy();
        
            // Return a success response
            return res.json({ message: 'Movie deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    },
}

const movieValidation = {
    title: {
        type: "string",
        min: 1,
        max: 150,
        optional: false
    },
    genres: {
        type: "string",
        min: 1,
        max: 50,
        optional: false
    },
    year: {
        type: "string",
        min: 1,
        max: 50,
        optional: false
    },
}

module.exports = MoviesController;