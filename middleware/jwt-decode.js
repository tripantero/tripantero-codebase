const jwt = require('jwt-simple');

module.exports = (key) => {
    return (req, res, next) => {
        res.jwt_token = jwt.decode(req.headers['x-access-token'], key);
        next();
    }
}