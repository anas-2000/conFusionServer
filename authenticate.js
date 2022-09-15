var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('./models/users');
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var jwt = require('jsonwebtoken');
var FacebookTokenStrategy = require('passport-facebook-token');

var config = require('./config');


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

exports.getToken = function(user){
    return jwt.sign(user, config.secretKey, {expiresIn: 3600});
};
// creating a json object 'opts'
var opts = {};
// will create a field 'jwtFromRequest' in the opts object. set it to ExtractJwt.fromAuthHEaderAsBearerToken(). Token will be included in the authentication header of the incoming request.
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();  // defines how the jwt is to be extracted from the incoming requests.
// will create a field 'secretOrKey' in the opts object. set it to config.secretKey
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, 
    (jwt_payload, done) => {
        console.log("JWT payload: ", jwt_payload);
        User.findOne({_id: jwt_payload._id}, (err, user) => {
            if(err){ // error occured
                return done(err, false);
            }
            else if (user){ // user is not null. i.e. found user
                return done(null, user);
            }
            else{ // user is null. i.e. could not find user
                return done(null, false);
            }
        });
    }));

    // using 'jwt' strategy for verifying user and not creating sessions.
    exports.verifyUser = passport.authenticate('jwt', {session: false});

    exports.verifyAdmin = function(req, res, next){
       if(req.user){
            if(req.user.admin){
                next();
            }
            else{
                err = new Error("You are not authorized to perform this operation!");
                err.status = 403;
                next(err);
            }
        }
        else{
            err = new Error("You are not authenticated");
            err.status = 401;
            next(err);
        }
       
    };

    exports.facebookPassport = passport.use(new FacebookTokenStrategy({
        clientID: config.facebook.clientId,
        clientSecret: config.facebook.clientSecret
    }, (accessToken, refreshToken, profile, done) => {
        User.findOne({facebookId: profile.id}, (err, user) => {
            if(err){ // if there is an error
                return done(err, false);
            }
            if(!err && user!== null){ // user has previously logged in using facebook
                return done(null, user);
            }
            else{ // user does not exist
                //this displayname, given name and family name etc are retrieved from the user's facebook profile.
                user = new User({ username: profile.displayName});
                user.facebookId = profile.id;
                user.firstname = profile.name.givenName;
                user.lastname = profile.name.familyName;
                user.save((err, user) => {
                    if(err){
                        return done(err, false); // user could not be created
                    }
                    else{
                        return done(null, user); // user successfully created
                    }
                });
            }
        }); // checking if the user has previously logged in using facebook
    }
    ));
    