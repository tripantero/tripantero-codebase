const Controller = new (require('./Controller').Controller)('/events', __filename);
const eventServ = require('../service/event.service');
const userServ = require('../service/session.service');
const direct = require('../middleware/session-validator');
Controller.middlewares.push(direct);
Controller.enableBodyparser();

let functional = (request, response) => {
    userServ.findOne({sessionID: request.session.key}, (err, docs) => {
        if(err) return console.log(err);
        if(docs == {} || docs == null) {
            return response.redirect('/');
        }
        let data = {
            event_author: docs._id,
            title: request.body.title,
            description: request.body.description,
            image_url: request.body.imageurl,
            timeHeld: request.body.timeHeld,
            date_created: Date.now(),
            participantId: [],
            peopleId: []
        };
        eventServ.save(data);
        response.redirect('/events');
    })
};

Controller.setController(functional);
Controller.setup();