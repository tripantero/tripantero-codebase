const Controller = new (require('./Controller').Controller)('/login', __filename);
const jwt = require('jwt-simple');
const bodyParser = require('body-parser');

Controller.append(bodyParser.json());
Controller.append(bodyParser.urlencoded({extended: false}));

let functional = (request, response)=>{
    let encode = jwt.encode({foo: "bar"}, process.env.KEY);
    response.header('x-access-token', encode);
    response.redirect('/')
};

Controller.setController(functional);
Controller.setup();