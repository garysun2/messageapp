//Will implement cookie setting in client side for easier request to api
// need to check client cookie userId against server session user id
// to prevent impersonation attempt

exports.loggedIn= (req,res,next)=>{
    if (req.isAuthenticated()) {
        return next();
    }
    return res.status(500).json({message: "Not authorized"});
}

//TODO: Find error code for different error 
exports.notLoggedIn=(req,res,next)=>{
    if (req.isAuthenticated()) {
        return res.status(500).json({message: 'Logged in, route not permitted'});
    }
    next();
}