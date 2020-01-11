const Controller = new (require('./Controller').Controller)('/login', __filename);
const authService = require('../service/session.service');
const generator = require('../auxiliary/sessionGenerator');
const validator = require('../middleware/session-validator');
Controller.middlewares.push(validator);
Controller.enableBodyparser();

let functional = (request, response) => {
    let sessionID = generator();
    authService.update({
        email: request.body.email,
        password: request.body.password
    }, {
        $set: {
            sessionID: sessionID,
            lastLogin: new Date()
        }
    });
    request.session.key = sessionID;
    response.redirect('/home');
};

Controller.setController(functional);
Controller.setup();