var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var disRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter'); 
const dishRouter = require('./routes/dishRouter');

const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

const url = 'mongodb://localhost:27017/conFusion'; 
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log('Connected successfully to the server');
}, (err) => {console.log(err)});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

function auth(req, res, next){
  console.log(req.headers);
  
  var authHeader = req.headers.authorization;

  if(!authHeader){ // if authHeader is null, it means that the client did not include authorization in the header.
    var err = new Error('You are not authenticated!');

    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    return next(err); // will go to error handler
  }

  var auth = new Buffer(authHeader.split(' ')[1], 'base64').toString().split(':'); // The authorization header is of the form ' basic username:password '
  // so we are splitting it first on the whitespace and then on the colin
  // so now the variable auth will contain 2 values: username and password

  var username = auth[0];
  var password = auth[1];

  if(username === 'admin' && password === 'password'){
    next(); // request will be passed to the next middleware
  }
  else{
    var err = new Error('You are not authenticated!');

    res.setHeader('WWW-Authenticate', 'Basic');
    err.status = 401;
    return next(err); // will go to error handler
  }
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
