const Controller = new(require('./Controller').Controller)('/events', __filename);
const Event = require('../service/event.service');
const Session = require('../service/session.service');
const validator = require('../middleware/session-validator');
Controller.middlewares.push(validator);


let functional = (request, response) => {
    Event.find({}, (err, events) => {
        Session.findOne({sessionID: request.session.key}, (err, docs) => {
            if(err || docs == null)  {
                request.session.destroy();
                return response.redirect('/')
            }
            response.render("events", {events, username: docs.username});
        })
    });
};

Controller.setController(functional);
Controller.setup();