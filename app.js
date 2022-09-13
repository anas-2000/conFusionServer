var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var passport = require('passport');
var authenticate = require('./authenticate');
var config = require('./config');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promoRouter');
var leaderRouter = require('./routes/leaderRouter'); 
var uploadRouter = require('./routes/uploadRouter'); 
//const dishRouter = require('./routes/dishRouter');

const mongoose = require('mongoose');

const Dishes = require('./models/dishes');

const url = config.mongoUrl; 
const connect = mongoose.connect(url);

connect.then((db) => {
  console.log('Connected successfully to the server');
}, (err) => {console.log(err)});

var app = express();

app.all('*', (req,res, next) => {
  if(req.secure){ // if the incoming request is secure then the secure flag which will be true else the secure flag in the incoming request will be set to false
    return next(); // just return to the normal flow because the incoming request is already on the secure port
  }
  else{
    res.redirect(307, 'https://'+ req.hostname + ':' + app.get('secPort') + req.url); //redirect to the secure port
  }
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser('12345-67890-09876-54321')); // Using signed cookise. We have passed a random string as a key.



app.use(passport.initialize());

//and will store it in session
// These 2 routes need to be before the authentication function because the user will first try to sign up or log in 
// and then the authentication will be carried out.
// So the '/' and '/users' endpoint can be accessed without being authenticated. Obviously ine would be authenticated only after loggin in /signing up
// However the rest of the endpoints cannot be accessed without being authenticated.
app.use('/', indexRouter);
app.use('/users', usersRouter);



app.use(express.static(path.join(__dirname, 'public')));


app.use('/dishes', dishRouter);
app.use('/promotions', promoRouter);
app.use('/leaders', leaderRouter);
app.use('/imageUpload', uploadRouter);

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
