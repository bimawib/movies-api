const fs = require('fs');
const path = require('path');
const Validator = require('fastest-validator');
const MovieRepository = require('../repository/MovieRepository');
const { projectPath } = require('../app-config');

const APP_HOSTNAME = process.env.APP_HOSTNAME;
const validationChecker = new Validator();

const MovieService = {
    async getMoviesIndex(pageQuery, limitQuery) {
        try {
            let page = parseInt(pageQuery) || 1;
            let limit = parseInt(limitQuery) || 10;
            const offset = (page - 1) * limit;

            if (limit > 100) {
                limit = 100;
            }

            const movies = await MovieRepository.getMoviesIndex(offset, limit);

            return movies;
        } catch(err) {
            throw new Error('Failed to fetch movies data');
        }
    },

    async getMovieById(id) {
        try {
            const movie = await MovieRepository.getMovieById(id);

            return movie;
        } catch(err) {
            throw new Error('Failed to fetch movie');
        }
    },

    async createMovie(field) {
        try {
            const { 
                title,
                genres,
                year,
                file
            } = field;

            let absoluteFilePath = file;
            let relativeFilePath;
            let fileLink;
            let staticLink;

            if(absoluteFilePath !== undefined){
                absoluteFilePath = file.path;
                relativeFilePath = path.relative(process.cwd(), absoluteFilePath);
                fileLink = relativeFilePath.replace(/\\/g, '/');
                staticLink = APP_HOSTNAME + fileLink;
            }
            
            const validate = validationChecker.validate({
                    title,
                    genres,
                    year
                }, this.movieValidation
            );

            if(validate.length){
                fs.unlinkSync(absoluteFilePath);
                throw new Error(validate[0].message);
            }

            const fieldValue = {
                title,
                genres,
                year,
                ...(fileLink !== undefined && { picture_link: staticLink })
            }

            const createdMovie = await MovieRepository.createMovie(fieldValue);
            return createdMovie;
        } catch(err) {
            throw new Error('Failed to create movie');
        }
    },

    async updateMovie(id, field){
        try {
            const { 
                title,
                genres,
                year,
                file
            } = field;

            let absoluteFilePath = file;
            let relativeFilePath;
            let fileLink;
            let staticLink;

            if(absoluteFilePath !== undefined){
                absoluteFilePath = file.path;
                relativeFilePath = path.relative(process.cwd(), absoluteFilePath);
                fileLink = relativeFilePath.replace(/\\/g, '/');
                staticLink = APP_HOSTNAME + fileLink;
            }

            const validate = validationChecker.validate({
                    title,
                    genres,
                    year
                }, this.movieValidation
            );

            const movie = await MovieRepository.getMovieById(id);
            
            if(validate.length || !movie){
                fs.unlinkSync(absoluteFilePath);
                throw new Error('Failed to update movie');
            }

            if(movie.picture_link && fileLink !== undefined){
                let fullUrl = movie.picture_link;
                let baseUrl = APP_HOSTNAME;
                let fileUrl = `/${fullUrl.split(baseUrl)[1]}`;
                let projectUrl = fileUrl.replace(/\//g, '\\');

                fs.unlinkSync(projectPath+projectUrl);
            }
            
            const fieldValue = {
                title,
                genres,
                year,
                ...(fileLink !== undefined && { picture_link: staticLink })
            }

            const updatedMovie = await MovieRepository.updateMovie(id, fieldValue);
            return updatedMovie;
        } catch(err) {
            throw new Error(err);
        }
    },

    async deleteMovie(id){
        try {
            const movie = await MovieRepository.getMovieById(id);

            if(!movie){
                return false;
            }

            if(movie.picture_link){
                let fullUrl = movie.picture_link;
                let baseUrl = APP_HOSTNAME;
                let fileUrl = `/${fullUrl.split(baseUrl)[1]}`;
                let projectUrl = fileUrl.replace(/\//g, '\\');
     
                fs.unlinkSync(projectPath+projectUrl);
            }

            const deletedMovie = await MovieRepository.deleteMovie(id);
            
            return {message: 'Movie deleted successfully!'};
        } catch(err) {
            throw new Error(err);
        }
    },

    movieValidation: {
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
    },
}

module.exports = MovieService;