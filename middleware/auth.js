const jwt = require('jsonwebtoken');
const asyncHandler = require('./async')
const ErrorResponse = require('../utils/errorResponse')
const model = require('../models/users/users')

exports.protect = asyncHandler( async (req,res,next) => {
    let token;
    
    //check token from headers request
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    } 
    // check token from cookies
    else if (req.cookies.token){
        token = req.cookies.token
    }

    if(!token) return next(new ErrorResponse('Not authorization to access this route'), 401);
    try {
        const decode = jwt.verify(token, process.env.JWT_SECRET)

        // console.log(decode);
        req.user = await model.findById(decode.id);
        
        next()
    } catch (error) {
        next(new ErrorResponse('Not authorization to access this route'), 401);
    }
})