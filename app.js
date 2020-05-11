const createError = require('http-errors');
const express = require('express');
var favicon = require('serve-favicon')
const path = require('path');
const logger = require('morgan');
const session = require('express-session')
const mongoose = require('mongoose');
var MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash')
const passport = require('passport')


const indexRouter = require('./routes/index');
const studentsRouter = require('./routes/students');
const staffsRouter = require('./routes/staffs');
const adminRouter = require('./routes/admin');

const app = express();

//DotEnv config
require('dotenv').config()

//Setting favicon.ico
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));


//Passport config
require('./config/passport')(passport)

//DB Config
const db = require('./config/keys').MongoURI;

//Connect to Mongo
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false })
    .then(() => console.log('Mongodb connected'))
    .catch((err) => console.log(err))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//Static Folder
app.use(express.static(path.join(__dirname, 'public')));



//Logger Middleware
app.use(logger('dev'));

//Body Parser Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Express-Session Middleware
app.use(session({
    cookie: { maxAge: 12 * 60 * 60 * 1000 },
    saveUninitialized: false,
    resave: false,
    secret: process.env.SESSION_SECRET,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}));

//Express flash Middleware
app.use(flash());

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());


// caching disabled for every route
app.use(function (req, res, next) {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});


//Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg')
    res.locals.error_msg = req.flash('error_msg')
    res.locals.error = req.flash('error')
    next()
})


//Routes
app.use('/', indexRouter);
app.use('/students', studentsRouter);
app.use('/staffs', staffsRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use((err, req, res, next) => {
    // set locals, only providing error in development
    res.locals.message = err.message;
    // res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    console.log(err);
    res.render('error', { title: "Error", message: err.message });
});

module.exports = app;
