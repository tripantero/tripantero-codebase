const Controller = new (require('./Controller').Controller)('/register', __filename);
const authService = require('../service/session.service');
const validator = require('../middleware/session-validator');
Controller.middlewares.push(validator);
Controller.enableBodyparser();

let functional = (request, response) => {
    if(!request.body.password == request.body.password_confirm) {
        response.send("password confirmation fail");
    }
    let records = {
        username: request.body.name,
        role: request.body.role,
        email: request.body.email.toLowerCase(),
        password: request.body.password.toLowerCase(),
        date: {
            registered: new Date(),
            lastLogin: new Date(),
            lastLogout: new Date()
        },
        listEventsCreatedId: [],
        listJoinedEventId: [],
        sessionID: ""
    }
    authService.save(records);
    response.redirect("/login");
};

Controller.setController(functional);
Controller.setup();