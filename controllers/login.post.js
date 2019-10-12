const Controller = new (require('./Controller').Controller)('/login', __filename);
const key = "Tripantero-c0h7a5i9";
const jwt = require('jwt-simple');
const decode = require('../middleware/jwt-decode')(key);
Controller.appendMiddleware(decode);

let functional = (request, response)=>{
    response.header('x-access-token', jwt.encode({
        foo: "bar"
    }, key));
    response.send();
};

Controller.setController(functional);
Controller.setup();