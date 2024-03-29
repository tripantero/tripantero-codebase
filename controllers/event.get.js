const Controller = new(require('./Controller').Controller)('/event/:eventId', __filename);
const eventService = require('../service/event.service');
const sessionServ = require('../service/session.service');
const validator = require('../middleware/session-validator');
const { ObjectId } = require('mongodb');
Controller.middlewares.push(validator);

let functional = (request, response) => {
    eventService.findOne({_id: new ObjectId(request.params.eventId)}, (err, docs) => {
        if(err) return response.send("Error on event get");
        validateEventauthor(request.session._id, docs).then((datas) => {
            datas.role = request.session.role;
            response.render("event", {
                ...datas
            })
        })
    });
};

Controller.setController(functional);
Controller.setup();

function validateEventauthor(id, docs) {
    docs.allowedJoin = true;
    if((docs.participantId.indexOf(id) != -1) || (docs.peopleId.indexOf(id) != -1)) {
        docs.allowedJoin = false;
    }
    return new Promise((resolve, reject) => {
        sessionServ.findOne(new ObjectId(docs.event_author), (err, { username }) => {
            docs.event_author = username;
            resolve(docs)
        })
    })
}