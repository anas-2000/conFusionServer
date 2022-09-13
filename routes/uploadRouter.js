const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');


const storage = multer.diskStorage({
    destination:(req, file, cb) => { // destination is defined as a function that takes 3 parameters: req object, file object and a callback function.
        cb(null, 'public/images'); //1st parameter to the callback function is error object. 2nd parameter to the callback function is the path to the destination folder
    }, 
    filename:(req, file, cb) =>{
        cb(null, file.originalname); //1st parameter to the callback function is error object. 2nd parameter to the callback function is the name of the file
        //file.originalname returns the name that the file had at the client side at the time of uploading.
    }
});

const imageFileFilter = (req, file, cb) => {
    if(!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)){// if the file's extension does not match any of these
        return cb(new Error('You can only upload image files!'), false);
    } 
    else{
        cb(null, true);
    }
};

const upload = multer({storage: storage, fileFilter: imageFileFilter});

const uploadRouter = express.Router();




uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
.get(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('GET operation not supported on /imageUpload');
})
.post(authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'),(req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json(req.file);
})
.put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /imageUpload');
})
.delete(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    res.statusCode = 403;
    res.end('DELETE operation not supported on /imageUpload');
});

module.exports = uploadRouter;