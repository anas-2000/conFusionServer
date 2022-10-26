const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Dishes = require('../models/dishes');

const req = require('express/lib/request');

const dishRouter = express.Router({mergeParams: true});




dishRouter.use(bodyParser.json());






//For all the request type (GET, POST etc) for the '/dishes' REST API endpoint, the code inside the callback function will be executed
// mounted at '/' endpoint




//the next function in the app.all will call the app.get, app.post etc depending on the request type.
// if any of the req and res are modified in the app.all then the modified parameters are passed to the 
// app.get, app.post etc.
dishRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);}) //for pre-flight request. That is if the options message is received (meaning a preflight request)
.get(cors.cors, (req, res, next) => {
    Dishes.find(req.query)
    .populate('comments.author') // This means that when the dishes are fetched from the database to be sent as the reply, then we will populate the
    // author field in the comments sub-document in each of the dish document. The population will be done from the User documents. So Mongoose will fetch the details
    // (username etc) from the User documents and put it in the author field of comments sub-document. 
    .then((dishes) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dishes); // takes in the parameter and converts it into json and sends as the response
    }, (err) => next(err)) //if an error occurs it will pass it to the error handler of our application
    .catch((err) => next(err));
    
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Dishes.create(req.body).then((dish) => {
        console.log('Dish Created ', dish);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})// no semi-colon here

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
}) // no semi-colon here
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req, res, next) => {
    Dishes.deleteMany({}).then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
}); //semi-colon here


dishRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, (req,res,next) =>{
    Dishes.findById(req.params.dishId)
    .populate('comments.author')
    .then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));

})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403;
    res.end('Post not supported on /dishes/'+req.params.dishId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    Dishes.findByIdAndUpdate(req.params.dishId, {
        $set: req.body
    }, {new: true}).then((dish) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(dish);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
    Dishes.findByIdAndDelete(req.params.dishId).then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

//=======================================================For Comments in dishes=======================================================================================\\




module.exports = dishRouter; //exporting this module
