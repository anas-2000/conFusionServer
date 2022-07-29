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






module.exports = dishRouter; //exporting this module
