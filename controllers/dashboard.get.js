const Controller = new(require('./Controller').Controller)('/dashboard', __filename);
const Event = require('../service/event.service');
const validator = require('../middleware/session-validator');
Controller.middlewares.push(validator);

let functional = (request, response) => {
    Event.find({}, (err, events) => {
        if (err) console.log(err);
        response.render("dashboard", {events});
    });
};

Controller.setController(functional);
Controller.setup();