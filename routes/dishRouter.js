const express = require('express');
const bodyParser = require('body-parser');
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
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next(); //What this 'next' function does is that it keeps looking for additional specifications down below (outside the app.all)
    //which will match the '/dishes' endpoint. 
})// no semi-colon here

//the next function in the app.all will call the app.get, app.post etc depending on the request type.
// if any of the req and res are modified in the app.all then the modified parameters are passed to the 
// app.get, app.post etc.
.get((req, res, next) => {
    res.end('Will send all the dishes to you!');
})
.post((req, res, next) => {
    res.end( 'Will add the dish: '+ req.body.name +' with details: '+ req.body.description);
})// no semi-colon here

.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
}) // no semi-colon here
.delete((req, res, next) => {
    res.end('Deleting all the dishes!');
}); //semi-colon here


dishRouter.route('/:dishId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) =>{
    res.end('Will send the dish '+req.params.dishId+' to you!');
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end('Post not supported on /dishes/'+req.params.dishId);
})
.put((req,res,next)=>{
    res.write('Updating the dish: '+req.params.dishId +'\n');
    res.end('Will update the dish: '+req.body.name +' with details : '+req.body.description);
})
.delete((req,res,next) =>{
    res.end('Deleting the dish '+req.params.dishId);
});






module.exports = dishRouter; //exporting this module
