const jwt = require('jwt-simple');

module.exports = (payload, key) => {
    return (req, res, next) => {
        res.headers['x-access-token'] = jwt.encode(payload, key);
        next();
    }
}