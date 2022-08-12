var express = require('express');
const bodyParser = require('body-parser');
var User = require('../models/users');
var passport = require('passport');


var router = express.Router();
router.use(bodyParser.json());

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

//We are using local strategy with passport to authenticate user, using passport.authenticate('local')
// In  the authenticate.js file, there is a line 'exports.local = passport.use(new LocalStrategy(User.authenticate()))'
// which means that the passport will use the local strategy since we have passed local strategy in it

router.post('/signup', (req, res, next) => {
  User.register( new User({username: req.body.username}), req.body.password, (err, user) => { //registering a new user
    if(err){  // if there is an error in the registration
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.json({err: err});
    }
    else{ //if the user is successfully registered
      passport.authenticate('local')(req, res, () => { //authenticating the user we just registered
        // passport.authenticate will automatically check whether the user exists or not, and so we do not have to wrtie code 
        // explicitly for it.
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json({sucess: true, status: 'Registration Successful!'});
      });
    }
  });
});

router.post('/login',passport.authenticate('local'), (req, res) =>{
  // when a post request will be sent to the  '/login' endpoint then:
  // first the passport middleware will be called, if it is successfull then the callback function will be called.  
  // when a user is logged in, the passport.authenticate('local') will automatically add the 'user' property to the request message.
  // so it will add req.user
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({sucess: true, status: 'Login Successful!'});
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
