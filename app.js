const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const path = require('path');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const swaggerJson = require('./swagger.json');

const client  = require('./db');

const moviesController = require('./controllers/MoviesController');
const usersController = require('./controllers/UsersController');
const authController = require('./controllers/AuthController');
const movieRouter = require('./routes/movies');
const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');

const app = express();

app.use(logger('dev'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.json());

// ROUTING
app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(swaggerJson)
);
app.get('/', (req, res) =>{
    res.send('API WORKING! 👍');
});

app.use('/api/movies', movieRouter);
app.use('/api/users', userRouter);
app.use('/auth', authRouter);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// LISTEN
app.listen(3000, function(){
    console.log('server running in port 3000');
});

// DB CONNECTION
client.connect(function(err){
    if(err){
        console.log(err.message);
    } else {
        console.log("Database Connected!");
    }
});

moviesController.setClient(client);
usersController.setClient(client);
authController.setClient(client);