const express = require('express');
const bodyParser = require('body-parser');
const req = require('express/lib/request');

const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const Leaders = require('../models/leaders');

const leaderRouter = express.Router({mergeParams: true});

leaderRouter.use(bodyParser.json());
//For all the request type (GET, POST etc) for the '/leaders' REST API endpoint, the code inside the callback function will be executed
// mounted at '/' endpoint

leaderRouter.route('/')
.get((req, res, next) => {
    Leaders.find({}).then((leaders) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leaders); // takes in the parameter and converts it into json and sends as the response
    }, (err) => next(err)) //if an error occurs it will pass it to the error handler of our application
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req, res, next) => {
    Leaders.create(req.body).then((leader) => {
        console.log('Leader Created ', leader);
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})// no semi-colon here

.put(authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
}) // no semi-colon here
.delete(authenticate.verifyUser, (req, res, next) => {
    Leaders.deleteMany({}).then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
}); //semi-colon here


leaderRouter.route('/:leaderId')
.get((req,res,next) =>{
    Leaders.findById(req.params.leaderId).then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(authenticate.verifyUser, (req,res,next)=>{
    res.statusCode = 403;
    res.end('Post not supported on /leaders/'+req.params.leaderId);
})
.put(authenticate.verifyUser, (req,res,next)=>{
    Leaders.findByIdAndUpdate(req.params.leaderId, {
        $set: req.body
    }, {new: true}).then((leader) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(leader);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(authenticate.verifyUser, (req,res,next) =>{
    Leaders.findByIdAndDelete(req.params.leaderId).then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});






module.exports = leaderRouter; //exporting this module
