const Controller = new(require('./Controller').Controller)('/register', __filename);
const direct = require('../middleware/session-direct');
Controller.middlewares.push(direct);

let functional = (request, response) => {
    response.render("register", {});
};

Controller.setController(functional);
Controller.setup();