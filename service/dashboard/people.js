const eventService = require('../event.service');
const sessionService = require('../session.service');
const { ObjectId } = require('mongodb');


function getJoinedRecords(userid, callback = (records = [])=>{}) {
    let query = {_id: new ObjectId(userid)};
    sessionService.collection.findOne(query, (err, resultFromSession) => {
        let joinedEvent = resultFromSession.listJoinedEventId;
        let eventsId = [];
        let result = {};
        joinedEvent.forEach((event_id) => {
            eventsId.push(event_id.eventId)
            result[""+event_id.eventId] = {
                type: event_id.type
            };
        })
        
        query = { _id: {
            $in: eventsId
        }};

        eventService.collection.find(query).toArray().then((element) => {
            element.forEach(({_id, title, place, timeHeld, participantId, peopleId}) => {
                result[""+_id] = {
                    title: title,
                    place: place,
                    timeHeld: timeHeld,
                    ...result[""+_id],
                    participantCount: participantId.length
                }
            })
            let keys = Object.keys(result);
            let callbackResult = [];
            keys.forEach((elementForEventKey) => {
                callbackResult.push(result[elementForEventKey])
            })
            callback(callbackResult);
        })
    });
}

module.exports = {
    peopleGetJoinedRecords : getJoinedRecords
}