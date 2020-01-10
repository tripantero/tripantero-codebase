const Controller = new (require('./Controller').Controller)('/login', __filename);
const authService = require('../service/session.service');
const validator = require('../middleware/session-validator');
Controller.middlewares.push(validator);

let functional = (request, response)=>{
    let data = {
        username: request.body.username,
        role: request.body.role,
        email: request.body.email,
        password: request.body.password,
        date: {
            registered: new Date(),
            lastLogin: "",
            lastVisit: ""
        },
        listEventsCreatedId: [],
        listJoinedEventId: [],
    }

    authService.save(data);
    response.redirect('/home')
};

Controller.setController(functional);
Controller.setup();