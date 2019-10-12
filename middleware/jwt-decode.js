const jwt = require('jwt-simple');

module.exports = (key) => {
    return (req, res, next) => {
        if(req.header('x-access-token')){
            res.jwt_decode = jwt.decode(req.header('x-access-token'), key);
        }
        next();
    }
}