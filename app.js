var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');

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
//app.use(cookieParser('12345-67890-09876-54321')); // Using signed cookise. We have passed a random string as a key.

app.use(session({
  name: 'session-id',
  secret: '12345-67890-09876-54321',
  resave: true,
  saveUninitialized: false,
  store: new FileStore()
}));

app.use(passport.initialize());
app.use(passport.session()); // will automatically serialize user information in req.user (added by passport.authenticate('local))
//and will store it in session
// These 2 routes need to be before the authentication function because the user will first try to sign up or log in 
// and then the authentication will be carried out.
// So the '/' and '/users' endpoint can be accessed without being authenticated. Obviously ine would be authenticated only after loggin in /signing up
// However the rest of the endpoints cannot be accessed without being authenticated.
app.use('/', indexRouter);
app.use('/users', usersRouter);

function auth(req, res, next){
  
  if(!req.user){ // req.user will be loaded in by the passport session middleware automatically.
    //if the signedCookies do not contain the user field it means that the user has not yet been authorized
    var err = new Error('You are not authenticated!');
    err.status = 403;
    return next(err); // will go to error handler
  }
  else{
    next();
  }

  
}

app.use(auth);

app.use(express.static(path.join(__dirname, 'public')));


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
