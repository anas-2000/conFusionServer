var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/users');
var passport = require('passport');
var authenticate = require('../authenticate');
var cors = require('./cors');

var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.options('*', cors.corsWithOptions, (req, res) => {res.statusCode(200);})
router.get('/', cors.corsWithOptions, authenticate.verifyUser,authenticate.verifyAdmin,function(req, res, next) {
  User.find({}).then((users)=>{
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(users);
  }, (err) => next(err))
  .catch((err) => next(err));
});

//We are using local strategy with passport to authenticate user, using passport.authenticate('local')
// In  the authenticate.js file, there is a line 'exports.local = passport.use(new LocalStrategy(User.authenticate()))'
// which means that the passport will use the local strategy since we have passed local strategy in it

router.post('/signup', cors.corsWithOptions, (req, res, next) => {
  User.register( new User({username: req.body.username}), req.body.password, (err, user) => { //registering a new user
    if(err){  // if there is an error in the registration
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else{ //if the user is successfully registered
      if(req.body.firstname) // if the body of the incoming request contains firstname then we will copy that to the firstname field of this user object that just signed up. 
      // (User schema contains firstname and lastname fields)
        user.firstname = req.body.firstname;
      if(req.body.lastname)
        user.lastname = req.body.lastname;
      user.save((err, user) => {
        if(err){
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.json({err: err});
          return;
        }
        passport.authenticate('local')(req, res, () => { //authenticating the user we just registered
          // passport.authenticate will automatically check whether the user exists or not, and so we do not have to wrtie code 
          // explicitly for it.
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({sucess: true, status: 'Registration Successful!'});
        });
      }) //saving the changes we made to this document
     
    }
  });
});

router.post('/login', cors.corsWithOptions, (req, res, next) =>{
  // when a post request will be sent to the  '/login' endpoint then:
  // first the passport middleware will be called, if it is successfull then the callback function will be called.  
  // when a user is logged in, the passport.authenticate('local') will automatically add the 'user' property to the request message.
  // so it will add req.user
  passport.authenticate('local', (err, user, info) => {
    if(err){
      return next(err);
    }
    if(!user){
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      res.json({sucess: false, status: 'Login Unsuccessful!', err: info});
    }
    //if these 2 conditions do not occur then the passport.authenticate will add the login method to the req object
    req.logIn(user, (err) => {
      if(err){
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json');
        res.json({sucess: false, status: 'Login Unsuccessful!', err: 'Could not log in the user!'});
      }
    
      // If we reach this point it means that the user has successfully logged in and we have to generate the token.
      var token = authenticate.getToken({_id: req.user._id});
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.json({sucess: true, status: 'Login Successful!', token: token});
  });
  })(req, res, next);
  

});

router.get('/logout', cors.corsWithOptions, (req, res) => {
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

router.get('/facebook/token', passport.authenticate('facebook-token'), (req, res) => {
  if(req.user){ //We have called passport.authenticate with facebook-token strategy. So if it is succesful, it will load the user object into the request object.
    var token = authenticate.getToken({_id: req.user._id});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({sucess: true, token: token, status: 'Login Successful!'});
  }
});

//if a client tries to access with a token that is expired then the server will not be able to authenticate the client.
// This route will check whether the client's token is still valid. If the token has expired then the client can initiate anothet login request.
router.get('checkJWTToken', cors.corsWithOptions, (req, res) => {
  passport.authenticate('jwt', {session: false}, (err, user, info) => {
    if(err){
      return next(err);
    }
    if(!user){
      res.statusCode = 401;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT invalid!', success: false, err: info})
    }
    else{
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      return res.json({status: 'JWT valid!', success: true, user: user});
    }
  }) (req, res);
})

module.exports = router;
