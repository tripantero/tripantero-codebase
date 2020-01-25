const Controller = new (require('./Controller').Controller)('/events', __filename);
const eventServ = require('../service/event.service');
const direct = require('../middleware/session-validator');
Controller.middlewares.push(direct);
Controller.enableBodyparser();

let functional = (request, response) => {
    let data = {
        event_author: request.body.event_author,
        title: request.body.title,
        description: request.body.description,
        image_url: request.body.image_url,
        timeHeld: request.body.timeHeld,
        date_created: Date.now(),
        participantId: [],
        peopleId: []
    };
    eventServ.save(data);
    response.redirect('/events');
};

Controller.setController(functional);
Controller.setup();