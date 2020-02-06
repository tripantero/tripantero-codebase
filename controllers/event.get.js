const Controller = new(require('./Controller').Controller)('/event/:eventId', __filename);
const eventService = require('../service/event.service');
const validator = require('../middleware/session-validator');
const { ObjectId } = require('mongodb');
Controller.middlewares.push(validator);

let functional = (request, response) => {
    eventService.findOne({_id: new ObjectId(request.params.eventId)}, (err, docs) => {
        if(err) return response.send("Error on event get");
        response.render("event", {
            ...validateEventauthor(request.session._id, docs)
        })
    });
};

Controller.setController(functional);
Controller.setup();

function validateEventauthor(id, docs) {
    if(! id == docs._id) {
        docs.allowedJoin = true;
    } else {
        docs.allowedJoin = false;
    }
    return docs;
}