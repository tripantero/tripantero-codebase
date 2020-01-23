const Controller = new(require('./Controller').Controller)('/add', __filename);
const validator = require('../middleware/session-validator');
Controller.middlewares.push(validator);
Controller.middlewares.push(require('../middleware/username-templater'));


let functional = (request, response) => {
    response.render("add");
};

Controller.setController(functional);
Controller.setup();