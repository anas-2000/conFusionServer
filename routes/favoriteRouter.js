const express = require('express');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Favorites = require('../models/favorites');

const req = require('express/lib/request');

const favoriteRouter = express.Router({mergeParams: true});

favoriteRouter.use(bodyParser.json());


favoriteRouter.route('/')
.options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {res.sendStatus(200);})
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.find({user: req.user._id})
    .populate('user')
    .populate('dishes')
    .then((favourites) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(favourites); // takes in the parameter and converts it into json and sends as the response
    }, (err) => next(err)) //if an error occurs it will pass it to the error handler of our application
    .catch((err) => next(err));
    
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favourite) => {
        if(favourite != null){
            for(var i = 0 ;  i <= (req.body.dishes.length -1); i++){ 
                var isInArray = favourite.dishes.some(function (dish) {
                    return dish.equals(req.body.dishes[i]._id);
                });
                if(!isInArray){  
                    favourite.dishes.push(req.body.dishes[i]._id);
                }
            }
            favourite.save().then((favourite) => {
                Favorites.findById(favourite._id)
                .populate('user') 
                .populate('dishes')
                .then((favourite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favourite);
                })
            }, (err) => next(err));
        }
        else{
            //favourite does not exist
            //creating favourite for the user
            var favourite = {
                'user': req.user._id,
            };
            Favorites.create(favourite).then((favourite) => {
                console.log('favourite created ', favourite);
                for(var i = (req.body.dishes.length - 1); i >= 0; i--){
                    favourite.dishes.push(req.body.dishes[i]._id);
                }
                favourite.save().then((favourite) => {
                    //Favorites.find({user: req.user._id})
                    Favorites.findById(favourite._id)
                    .populate('user')
                    .populate('dishes')
                    .then((favourite) => {
                        res.statusCode = 200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favourite);
                    })
                })
            }, (err) => next(err))
            .catch((err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favouites/');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOneAndDelete({user: req.user._id}).then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {res.sendStatus(200);})
.get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorites) => {
        if(!favorites){
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            return res.json({"exists": false, "favorites": favorites});
        }
        else{
            if(favorites.dishes.indexOf(req.params.dishId) < 0){
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": false, "favorites": favorites});
            }
            else{
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                return res.json({"exists": true, "favorites": favorites});
            }
        }
    }, (err) => next(err))
    .catch((err) => next(err))
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/'+req.params.dishId);
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favourite) => {
        if(favourite != null ){
            var isInArray = favourite.dishes.some(function (dish) {
                return dish.equals(req.params.dishId);
            });
            if(isInArray){
                err = new Error('Dish '+ req.params.dishId + ' is already added to favorites');
                err.status = 403;
                return next(err);
            }
            else{
                favourite.dishes.push(req.params.dishId);
            }
            favourite.save().then((favourite) => {
                Favorites.findById(favourite._id)
                .populate('user') 
                .populate('dishes')
                .then((favourite) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favourite);
                })
            }, (err) => next(err));
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({user: req.user._id})
    .then((favorite)=> {
        favorite.dishes.pull(req.params.dishId);
        favorite.save().then((favourite) => {
            Favorites.findById(favourite._id)
            .populate('user') 
            .populate('dishes')
            .then((favourite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favourite);
            })
        }, (err) => next(err));
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = favoriteRouter;
