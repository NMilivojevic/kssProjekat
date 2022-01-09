const jwt = require("jsonwebtoken");
const config = require("config");

// we are exporting a middleware function 
module.exports = function (req, res, next) {
    // get the token from header because when we send a request to a protected route the token ins going to be inside the header 
    const token = req.header("x-auth-token");
    // check if no token 
    if (!token) {
        return res.status(401).json({ msg: "No token, authorization denied." })
    }
    // verify token 
    try {
        const decoded = jwt.verify(token, config.get("jwtSecret")); // this will decode the token
        req.user = decoded.user;
        next();
    } catch (err) {
        res.status(401).json({ msg: "Token is not valid. " })
    }
}