const Controller = new(require('./Controller').Controller)('/join/:eventId', __filename);
const Event = require('../service/event.service');
const session = require('../service/session.service');
const validator = require('../middleware/session-validator');
const { ObjectId } = require('mongodb');
Controller.middlewares.push(validator);


let functional = (request, response) => {
    
    new Promise((resolve, reject) => {
        let query = {_id : new ObjectId(request.session._id)};
        session.findOne(query, (err, docs) => {
            resolve(docs.role);
        })
    }).then((role) => {
        let query = {_id : new ObjectId(request.params.eventId)};
        Event.findOne(query, (err, docs) => {
            new Promise((resolve, reject) => {
                Event.remove(query)
                setTimeout(() => {
                    resolve();
                }, 200);
            }).then(() => {
                console.log(role == "businessman");
                if(role == "businessman") {
                    docs.participantId.push(request.session._id);
                    response.redirect("/events")
                } else {
                    docs.peopleId.push(request.session._id);
                }
                Event.save(docs)
            })
        });
    });
};

Controller.setController(functional);
Controller.setup();