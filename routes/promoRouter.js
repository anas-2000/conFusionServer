const express = require('express');
const bodyParser = require('body-parser');
const req = require('express/lib/request');

const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Promotions = require('../models/promotions');

const promoRouter = express.Router({mergeParams: true});




promoRouter.use(bodyParser.json());






//For all the request type (GET, POST etc) for the '/promo' REST API endpoint, the code inside the callback function will be executed
// mounted at '/' endpoint

promoRouter.route('/')
//the next function in the app.all will call the app.get, app.post etc depending on the request type.
// if any of the req and res are modified in the app.all then the modified parameters are passed to the 
// app.get, app.post etc.
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, (req, res, next) => {
    Promotions.find(req.query).then((promotions) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotions); // takes in the parameter and converts it into json and sends as the response
    }, (err) => next(err)) //if an error occurs it will pass it to the error handler of our application
    .catch((err) => next(err));
    
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.create(req.body).then((promotion) => {
        console.log('Promotion Created ', promotion);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})// no semi-colon here

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
}) // no semi-colon here
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Promotions.deleteMany({}).then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
}); //semi-colon here


promoRouter.route('/:promoId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, (req,res,next) =>{
    Promotions.findById(req.params.promoId).then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    res.statusCode = 403;
    res.end('Post not supported on /promotions/'+req.params.promoId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    Promotions.findByIdAndUpdate(req.params.promoId, {
        $set: req.body
    }, {new: true}).then((promotion) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(promotion);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
    Promotions.findByIdAndDelete(req.params.promoId).then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});



//------------------------------------------------------------------------------------------------------------------------------------------------------

module.exports = promoRouter; //exporting this module
