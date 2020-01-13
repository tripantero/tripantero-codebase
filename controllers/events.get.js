const Controller = new(require('./Controller').Controller)('/events', __filename);
const Event = require('../service/event.service');

let functional = (request, response) => {
    Event.find({}, (err, events) => {
        response.render("events", {events});
    });
};

Controller.setController(functional);
Controller.setup();