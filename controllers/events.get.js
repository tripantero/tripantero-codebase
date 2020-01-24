const Controller = new(require('./Controller').Controller)('/events', __filename);
const Event = require('../service/event.service');
const validator = require('../middleware/session-validator');
Controller.middlewares.push(validator);


let functional = (request, response) => {
    Event.find({}, (err, events) => {
        if(err) {
            return console.log("Error on events.js");
        }
        response.render("events", {
            events: events
        });
    });
};

Controller.setController(functional);
Controller.setup();