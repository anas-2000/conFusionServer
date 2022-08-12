var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users');


// passport-local module lets you authenticate using a username and password in your Node.js applications. 
// By plugging into Passport, local authentication can be easily and unobtrusively integrated

// configuring passport with local strategy
// We supply LocalStrategy (provided by passport-local.Strategy) to passport.
// This local strategy takes in a 'verify' function.
// This 'verify' function can be written by ourselves. 
// But since we are also using passport-local-mongoose, it provides a function 'schema-model.authenticate()' that can be passed as a verify function.
// This verify function (authenticate() in our case) will be called with the 'username' and 'password' that the passport will extract
// from the body of our request.
// So we will supply username and password inside the body of our requests.
// Using bodyparser passport will retrieve the username and password from the body of the request and supply them
// as the parameters to the 'verify' function (authenticate() in this case).
exports.local = passport.use(new LocalStrategy(User.authenticate()));
// Since we are using sessions to track users, we need to serialize and deserialize the users.
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// The User.serializeUser() and User.deserializeUser() functions are provided on the User schema by the 'passport-local-mongoose' plugin.