const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = ['http://localhost:3000', 'https://localhost:3443', 'http://LAPTOP-0VMHDR2K:3001']; // contains all the origins that the server is willing to accept
var corsOptionDelegate = (req, callback) => {
    var corsOptions;

    if(whitelist.indexOf(req.header('Origin')) !== -1){// if the request header contains the Origin field, then check its value and see if the whitelist vontains that origin valueS
        corsOptions = {origin: true};
    }
    else{
        corsOptions = {origin: false};
    }
    callback(null, corsOptions);
};

exports.cors = cors(); // allows all routes
exports.corsWithOptions = cors(corsOptionDelegate); // if we want to applly cors to a particular route