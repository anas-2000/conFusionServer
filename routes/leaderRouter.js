const express = require('express');
const bodyParser = require('body-parser');
const req = require('express/lib/request');

const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const Leaders = require('../models/leaders');
const cors = require('./cors');
const leaderRouter = express.Router({mergeParams: true});

leaderRouter.use(bodyParser.json());
//For all the request type (GET, POST etc) for the '/leaders' REST API endpoint, the code inside the callback function will be executed
// mounted at '/' endpoint

leaderRouter.route('/')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, (req, res, next) => {
    Leaders.find(req.query).then((leaders) => { // query paramater contains the featured parameter. i.e. whether featured is true or not
        // if  a query parameter is passed as true i.e. a get request is made to the endpoint /leaders?featured=true, then this will
        //search for all the leaders that are featured.
        res.statusCode = 200; 
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders); // takes in the parameter and converts it into json and sends as the response
    }, (err) => next(err)) //if an error occurs it will pass it to the error handler of our application
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.create(req.body).then((leader) => {
        console.log('Leader Created ', leader);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})// no semi-colon here

.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
}) // no semi-colon here
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Leaders.deleteMany({}).then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
}); //semi-colon here


leaderRouter.route('/:leaderId')
.options(cors.corsWithOptions, (req, res) => {res.sendStatus(200);})
.get(cors.cors, (req,res,next) =>{
    Leaders.findById(req.params.leaderId).then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    res.statusCode = 403;
    res.end('Post not supported on /leaders/'+req.params.leaderId);
})
.put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next)=>{
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, {new: true}).then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (req,res,next) =>{
    Leaders.findByIdAndDelete(req.params.leaderId).then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});






module.exports = leaderRouter; //exporting this module
