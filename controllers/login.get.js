const Controller = new(require('./Controller').Controller)('/login', __filename);
const direct = require('../middleware/session-direct');
Controller.middlewares.push(direct);

let functional = (request, response) => {
    response.render("login", {});
};

Controller.setController(functional);
Controller.setup();