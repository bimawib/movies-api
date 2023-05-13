const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const client  = require('./db');

const MoviesController = require('./controllers/MoviesController');
const UsersController = require('./controllers/UsersController');
const AuthControllers = require('./controllers/AuthController');
const movieRouter = require('./routes/movies');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const app = express();

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'EXPRESS API WITH SWAGGER',
            version: '1.0.0',
            description: 'Simple CRUD App for DVD Rental'
        },
        servers: [
            {
                url: 'http://localhost:3000'
            }
        ]
    },
    apis: ['./routes/*.js'],
}
const specs = swaggerJsdoc(options);

app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, {explorer: true})
);
app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());

app.get('/', (req, res) =>{
    res.send('API WORKING! 👍');
});
app.use('/api/movies', movieRouter);
app.use('/api/users', userRouter);
app.use('/auth', authRouter);

app.listen(3000, function(){
    console.log('server running in port 3000');
});

client.connect(function(err){
    if(err){
        console.log(err.message);
    } else {
        console.log("Database Connected!");
    }
});

MoviesController.setClient(client);
UsersController.setClient(client);
AuthControllers.setClient(client);