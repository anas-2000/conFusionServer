var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');
//Passport-Local Mongoose is a Mongoose plugin that simplifies building username and password login with Passport.
// The passport local mongoose plugin will automatically add username and password to our schema

var User = new Schema({
    admin:{
        type: Boolean,
        default: false
    }
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);