const Controller = new (require('./Controller').Controller)('/register', __filename);
const authService = require('../service/session.service');
const direct = require('../middleware/session-direct');
Controller.middlewares.push(direct);
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
    authService.findOne({"email": "danielarya175@gmail.com"}, (err, res)=>{
        if(err) return err;
        if(res == null) {
            authService.save(records);
        }
    });
    response.redirect("/login");
};

Controller.setController(functional);
Controller.setup();