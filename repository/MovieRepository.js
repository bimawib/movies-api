let client;
const { Movies } = require('../models');

const MovieRepository = {
    setClient(dbClient) {
        client = dbClient;
    },

    async getMoviesIndex(offset, limit) {
        const result = await client.query('SELECT * FROM movies OFFSET $1 LIMIT $2', [offset, limit]);
        const movies = result.rows;
        return movies;
    },

    async getMovieById(id){
        const movie = await Movies.findByPk(id);
        return movie;
    },

    async createMovie(field){
        const createdMovies = await Movies.create(field);
        return createdMovies;
    },

    async updateMovie(id, field){
        const updatedMovies = await Movies.update(field, {
            where: {id: id}
        });
        const updatedMovie = await Movies.findByPk(id);
        return updatedMovie;
    },

    async deleteMovie(id){
        try {
            const deletedMovie = await Movies.destroy({
                where: {id}
            });
            return deletedMovie;
        } catch (error) {
            throw new Error(error);
        }
    }

}

module.exports = MovieRepository;