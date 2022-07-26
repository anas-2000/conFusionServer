const express = require('express');
const bodyParser = require('body-parser');
const req = require('express/lib/request');

const leaderRouter = express.Router({mergeParams: true});




leaderRouter.use(bodyParser.json());






//For all the request type (GET, POST etc) for the '/leaders' REST API endpoint, the code inside the callback function will be executed
// mounted at '/' endpoint

leaderRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next(); //What this 'next' function does is that it keeps looking for additional specifications down below (outside the app.all)
    //which will match the '/leaders' endpoint. 
})// no semi-colon here

//the next function in the app.all will call the app.get, app.post etc depending on the request type.
// if any of the req and res are modified in the app.all then the modified parameters are passed to the 
// app.get, app.post etc.
.get((req, res, next) => {
    res.end('Will send all the leaders to you!');
})
.post((req, res, next) => {
    res.end( 'Will add the leader: '+ req.body.name +' with details: '+ req.body.description);
})// no semi-colon here

.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
}) // no semi-colon here
.delete((req, res, next) => {
    res.end('Deleting all the leaders!');
}); //semi-colon here


leaderRouter.route('/:leaderId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) =>{
    res.end('Will send the leader '+req.params.leaderId+' to you!');
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end('Post not supported on /leaders/'+req.params.leaderId);
})
.put((req,res,next)=>{
    res.write('Updating the leader: '+req.params.leaderId +'\n');
    res.end('Will update the leader: '+req.body.name +' with details : '+req.body.description);
})
.delete((req,res,next) =>{
    res.end('Deleting the leader '+req.params.leaderId);
});






module.exports = leaderRouter; //exporting this module
