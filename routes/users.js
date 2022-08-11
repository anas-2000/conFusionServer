var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/users');
var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.post('/signup', (req, res, next) => {
  User.findOne({username: req.body.username}) //The username and password will be sent in the body of the post request.
  // So we will take the username from the body of the request and search it in our database in the User Schema.
  .then((user) => {
    if(user != null){  // If the username exists, then the user already exists and so a new username should be selected since duplicate usernames are not allowed.
      var err = new Error('User '+req.body.username+' already exists!');
      err.status = 403;
      next(err);
    }
    else{// If the user does not exists, we will allow to signup
      return User.create({
        username: req.body.username,
        password: req.body.password
      });
    }
  })
  .then((user)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({status: 'Registration Successful!', user: user});
  }, (err) => next(err))
  .catch((err) => next(err));
});

router.post('/login', (req, res, next) =>{
  if(!req.session.user){ // 'user' is a property that we have set up in the 'signed cookies' 
    //if the signedCookies do not contain the user field it means that the user has not yet been authorized
//if req.session.user is not set it means that the user has not yet signed in

      var authHeader = req.headers.authorization;

    if(!authHeader){ // if authHeader is null, it means that the client did not include authorization in the header.
      var err = new Error('You are not authenticated!');

      res.setHeader('WWW-Authenticate', 'Basic');
      err.status = 401;
      return next(err); // will go to error handler
    }

    var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':'); // The authorization header is of the form ' basic username:password '
    // so we are splitting it first on the whitespace and then on the colin
    // so now the variable auth will contain 2 values: username and password

    var username = auth[0];
    var password = auth[1];


    User.findOne({username: username})
    .then((user)=> {
      if(user === null){
        var err = new Error('User '+username+' does not exist!');
        err.status = 403;
        return next(err); // will go to error handler
      }
      else if(user.password !== password){
        var err = new Error('Incorrect password!');
        err.status = 403;
        return next(err);
      }
      else if(user.username === username && user.password === password){
        req.session.user = 'authenticated';
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end('You are authenticated');
      }
    }).catch((err)=>next(err));


  }
  else{// if req.session.user is set it means that the user is already logged in
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    res.end('You are already authenticated');
  }
});

router.get('/logout', (req, res) => {
  if(req.session){ // if session exists
    req.session.destroy(); // session is destroyed and information regarding the session is removed from the server side.
    res.clearCookie('session-id'); //asks the client to clear the cookie witht the name 'session-id'.
    res.redirect('/');
  }
  else{
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});

module.exports = router;
