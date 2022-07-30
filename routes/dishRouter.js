const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const Dishes = require('../models/dishes');

const req = require('express/lib/request');

const dishRouter = express.Router({mergeParams: true});




dishRouter.use(bodyParser.json());


/*
dishRouter.param('dishId', function(req, res, next, id){
    req.params.dishId =id;
    next()
})

*/





//For all the request type (GET, POST etc) for the '/dishes' REST API endpoint, the code inside the callback function will be executed
// mounted at '/' endpoint

dishRouter.route('/')


//the next function in the app.all will call the app.get, app.post etc depending on the request type.
// if any of the req and res are modified in the app.all then the modified parameters are passed to the 
// app.get, app.post etc.
.get((req, res, next) => {
    Dishes.find({}).then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes); // takes in the parameter and converts it into json and sends as the response
    }, (err) => next(err)) //if an error occurs it will pass it to the error handler of our application
    .catch((err) => next(err));
    
})
.post((req, res, next) => {
    Dishes.create(req.body).then((dish) => {
        console.log('Dish Created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})// no semi-colon here

.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
}) // no semi-colon here
.delete((req, res, next) => {
    Dishes.deleteMany({}).then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
}); //semi-colon here


dishRouter.route('/:dishId')
.get((req,res,next) =>{
    Dishes.findById(req.params.dishId).then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));

})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end('Post not supported on /dishes/'+req.params.dishId);
})
.put((req,res,next)=>{
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, {new: true}).then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req,res,next) =>{
    Dishes.findByIdAndDelete(req.params.dishId).then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

//=======================================================For Comments in dishes=======================================================================================\\

dishRouter.route('/:dishId/comments')
.get((req, res, next) => {
    Dishes.findById(req.params.dishId).then((dish) => {
        if(dish != null){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);
        }
        else{
            err = new Error('Dish '+ req.params.dishId + ' not found');
            err.status = 404;
            return next(err); // This will be handled by app.js
            //In app.js at the bottom we have implemented error handler
        }
         
    }, (err) => next(err)) //if an error occurs it will pass it to the error handler of our application
    .catch((err) => next(err));
    
})
.post((req, res, next) => {
    Dishes.findById(req.params.dishId).then((dish) => {
        if(dish != null){
            dish.comments.push(req.body);
            dish.save().then((dish) => {
                //If successfully added the comment
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err));
        }
        else{
            err = new Error('Dish '+ req.params.dishId + ' not found');
            err.status = 404;
            return next(err); // This will be handled by app.js
            //In app.js at the bottom we have implemented error handler
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})// no semi-colon here

.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes/'+req.params.dishId +'/comments');
}) // no semi-colon here
.delete((req, res, next) => {
    Dishes.findById(req.params.dishId).then((dish) => {
        if(dish != null){
            for(var i = (dish.comments.length - 1); i >= 0; i--){ // iterating over each comment and deleting it
                dish.comments.id(dish.comments[i]._id).remove();
            }
        }
        else{
            err = new Error('Dish '+ req.params.dishId + ' not found');
            err.status = 404;
            return next(err); // This will be handled by app.js
            //In app.js at the bottom we have implemented error handler
        }
    }, (err) => next(err))
    .catch((err) => next(err));
}); //semi-colon here


dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next) =>{
    Dishes.findById(req.params.dishId).then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null ){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));
        }
        else if (dish == null){
            err = new Error('Dish '+ req.params.dishId + ' not found');
            err.status = 404;
            return next(err); // This will be handled by app.js
            //In app.js at the bottom we have implemented error handler
        }
        else{ //dish exists but comment does not exist
            err = new Error('Comment '+ req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));

})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end('Post not supported on /dishes/'+req.params.dishId +'/comments/'+req.params.commentId);
})
.put((req,res,next)=>{
    Dishes.findById(req.params.dishId).then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null ){
            if(req.body.rating){
                dish.comments.id(req.params.commentId).rating = req.body.rating; // updating the rating
            }
            if(req.body.comment){
                dish.comments.id(req.params.commentId).comment = req.body.comment; //updating the comment
            }
            dish.save().then((dish) => {
                //If comment updated successfully
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err));
        }
        else if (dish == null){
            err = new Error('Dish '+ req.params.dishId + ' not found');
            err.status = 404;
            return next(err); // This will be handled by app.js
            //In app.js at the bottom we have implemented error handler
        }
        else{ //dish exists but comment does not exist
            err = new Error('Comment '+ req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req,res,next) =>{
    Dishes.findById(req.params.dishId).then((dish) => {
        if(dish != null && dish.comments.id(req.params.commentId) != null){ 
            dish.comments.id(req.params.commentId).remove();
            dish.save().then((dish) => {
                //If comment deleted successfully
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);
            }, (err) => next(err));
        }
        else if (dish == null){
            err = new Error('Dish '+ req.params.dishId + ' not found');
            err.status = 404;
            return next(err); // This will be handled by app.js
            //In app.js at the bottom we have implemented error handler
        }
        else{ //dish exists but comment does not exist
            err = new Error('Comment '+ req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});




module.exports = dishRouter; //exporting this module
