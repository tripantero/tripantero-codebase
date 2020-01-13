const Controller = new (require('./Controller').Controller)('/login', __filename);
const authService = require('../service/session.service');
const generator = require('../auxiliary/sessionGenerator');
const direct = require('../middleware/session-direct');
Controller.middlewares.push(direct);
Controller.enableBodyparser();

let functional = (request, response) => {
    let sessionID = generator();
    authService.update({
        email: request.body.email.toLowerCase(),
        password: request.body.password.toLowerCase()
    }, {
        $set: {
            sessionID: sessionID,
            lastLogin: new Date()
        }
    });
    request.session.key = sessionID;
    response.redirect('/events');
};

Controller.setController(functional);
Controller.setup();