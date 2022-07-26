const express = require('express');
const bodyParser = require('body-parser');
const req = require('express/lib/request');

const promoRouter = express.Router({mergeParams: true});




promoRouter.use(bodyParser.json());






//For all the request type (GET, POST etc) for the '/promo' REST API endpoint, the code inside the callback function will be executed
// mounted at '/' endpoint

promoRouter.route('/')
.all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next(); //What this 'next' function does is that it keeps looking for additional specifications down below (outside the app.all)
    //which will match the '/promos' endpoint. 
})// no semi-colon here

//the next function in the app.all will call the app.get, app.post etc depending on the request type.
// if any of the req and res are modified in the app.all then the modified parameters are passed to the 
// app.get, app.post etc.
.get((req, res, next) => {
    res.end('Will send all the promotionss to you!');
})
.post((req, res, next) => {
    res.end( 'Will add the promo: '+ req.body.name +' with details: '+ req.body.description);
})// no semi-colon here

.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
}) // no semi-colon here
.delete((req, res, next) => {
    res.end('Deleting all the promotions!');
}); //semi-colon here


promoRouter.route('/:promoId')
.all((req,res,next) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    next();
})
.get((req,res,next) =>{
    res.end('Will send the promo '+req.params.promoId+' to you!');
})
.post((req,res,next)=>{
    res.statusCode = 403;
    res.end('Post not supported on /promotions/'+req.params.promoId);
})
.put((req,res,next)=>{
    res.write('Updating the promo: '+req.params.promoId +'\n');
    res.end('Will update the promo: '+req.body.name +' with details : '+req.body.description);
})
.delete((req,res,next) =>{
    res.end('Deleting the promo '+req.params.promoId);
});



module.exports = promoRouter; //exporting this module
