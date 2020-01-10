const Controller = new (require('./Controller').Controller)('/register', __filename);
const authService = require('../service/session.service');
Controller.enableBodyparser();

let functional = (request, response) => {
    if(!request.body.password == request.body.password_confirm) {

    }
    let records = {
        username: request.body.name,
        role: request.body.role,
        email: request.body.email,
        password: request.body.password,
        date: {
            registered: new Date(),
            lastLogin: new Date(),
            lastVisit: new Date()
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