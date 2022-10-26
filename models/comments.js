const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    author: {// Author is of the ObjectId type. ref: 'User' Means that the ObjectId will be of 'User' type. i.e. Author will store ObjectId of User documents.
        // This means that we do not have to store author details (username etc) again, and can simply retrieve it from the User documents using the ObjectId referenced here.
        type: mongoose.Schema.Types.ObjectId, // so we can fetch author details from 'User' Schema, using the ObjectId from the User documents in the User Schema.
        ref: 'User' // Referencing to the 'User' Schema
    },
    dish:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Dish'
    }
},{
    timestamps: true
});

var Comments = mongoose.model('Comment', commentSchema);

module.exports = Comments;