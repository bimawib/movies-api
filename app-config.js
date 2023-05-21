const path = require('path');

const movieRepository = require('./repository/MovieRepository');
const userRepository = require('./repository/UserRepository');
const authController = require('./controllers/AuthController');

const appConfig = {
    projectPath: path.resolve(__dirname),

    async setClient(client){
        movieRepository.setClient(client);
        userRepository.setClient(client);
        
        authController.setClient(client);
    }
}

module.exports = appConfig;