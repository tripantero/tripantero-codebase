const Controller = new(require('./Controller').Controller)('/events', __filename);
const Event = require('../service/event.service');
const validator = require('../middleware/session-validator');
Controller.middlewares.push(validator);


let functional = (request, response) => {
    Event.find({}, (err, events) => {
        console.log(err)
        response.render("events", {events});
    });
};

Controller.setController(functional);
Controller.setup();