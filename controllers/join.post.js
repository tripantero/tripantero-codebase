const Controller = new(require('./Controller').Controller)('/join/:eventId', __filename);
const Event = require('../service/event.service');
const session = require('../service/session.service');
const validator = require('../middleware/session-validator');
const { ObjectId } = require('mongodb');
Controller.enableBodyparser();
Controller.middlewares.push(validator);


let functional = (request, response) => {
    new Promise((resolve, reject) => {
        let query = {_id : new ObjectId(request.session._id)};
        session.findOne(query, (err, docs) => {
            resolve(docs);
        })
    }).then(({role, _id}) => {
        let query = {_id : new ObjectId(request.params.eventId)};
        Event.findOne(query, (err, docs) => {
            new Promise((resolve, reject) => {
                Event.remove(query)
                resolve(docs._id);
            }).then((event_id) => {
                if(role == "businessman") {
                    docs.participantId.push(request.session._id);
                    response.redirect("/events")
                } else {
                    docs.peopleId.push(request.session._id);
                    response.redirect("/events")
                }
                session.collection.updateOne({_id: new ObjectId(_id)}, {
                    $push: {
                        "listJoinedEventId": event_id
                    }
                }, (err, result)=> {
                    if(err) {
                        return console.error(err)
                    }
                })
                Event.save(docs)
            })
        });
    });
};

Controller.setController(functional);
Controller.setup();