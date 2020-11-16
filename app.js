const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const promisify = require('es6-promisify');
const flash = require('connect-flash');
const expressValidator = require('express-validator');
const routes = require('./routes/index');
const helpers = require('./helpers');
const errorHandlers = require('./handlers/errorHandlers');
const router = require('./routes/index');
require('./handlers/passport');

// create Express app
const app = express();

module.exports = app;

// view engine setup
app.set('views', path.join(__dirname, 'views')); // this is the folder where we keep our pug files
app.set('view engine', 'pug'); // we use the engine pug, mustache or EJS work great too

//!globalni midleware-ovi
// static files in public folder
app.use(express.static(path.join(__dirname, 'public')));

// get data from form submit and put it into req.body
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// validating data
app.use(expressValidator());

//? Passport JS to handle our logins
app.use(passport.initialize());
app.use(passport.session());

app.use(
    session({
        secret: process.env.SECRET,
        key: process.env.KEY,
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({ mongooseConnection: mongoose.connection }),
    })
);

//? varijable se prosledjuju templejtu u svim request-ovima
// pass variables to our templates + all requests
app.use((req, res, next) => {
    res.locals.h = helpers;
    res.locals.user = req.user || null; //! salje usera ako je ulogovan inace salje null
    res.locals.currentPath = req.path;
    next();
});

app.use((req, res, next) => {
    req.login = promisify(req.login, req);
    next();
});

// after every / run routes
app.use('/', routes);

// if above routes didnt work, 404 them and forward to error handler
app.use(errorHandlers.notFound);
