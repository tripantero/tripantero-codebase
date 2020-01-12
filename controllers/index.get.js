const Controller = new(require('./Controller').Controller)('/', __filename);
const validator = require('../middleware/session-validator');
Controller.middlewares.push(validator);

let functional = (request, response) => {
    response.render("index")
};

Controller.setController(functional);
Controller.setup();