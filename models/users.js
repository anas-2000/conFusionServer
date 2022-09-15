var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
//Passport-Local Mongoose is a Mongoose plugin that simplifies building username and password login with Passport.
// The passport local mongoose plugin will automatically add username and password to our schema

var User = new Schema({
    firstname:{
        type: String,
        default: ''
    },
    lastname:{
        type: String,
        default: ''
    },
    facebookId: String, // when the user logs in using facebook and obtains access token and passes it to the express server, 
    //the express server will use this token to fetch the profile information from the facebook OAuth server, 
    //and after obtaining the profile information the express server will create a new user account and use the facebookId as the index into this user account
    admin:{
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);