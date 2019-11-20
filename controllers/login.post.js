const Controller = new (require('./Controller').Controller)('/login', __filename);
const jwt = require('jwt-simple');


let functional = (request, response)=>{
    let encode = jwt.encode({foo: "bar"}, process.env.KEY);
    response.header('x-access-token', encode);
    response.redirect('/')
};

Controller.setController(functional);
Controller.setup();