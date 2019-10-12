const jwt = require('jwt-simple');

module.exports = (req, res, next) => {
    if(req.header('x-access-token')){
        req.jwt_decode = jwt.decode(req.header('x-access-token'), process.env.KEY);
    }
    next();
}