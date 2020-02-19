const eventService = require('../event.service');
const sessionService = require('../session.service');
const { ObjectId } = require('mongodb');

function getJoinedRecords(userid, callback = (records = [])=>{}) {
    let query = {_id: new ObjectId(userid)};
    sessionService.collection.findOne(query, (err, resultFromSession) => {
        let length = (resultFromSession.listJoinedEventId.length);
        if(length == 0) {
            callback([]);
        }else{
            for (let index = 0; index < length; index++) {
                resultFromSession.listJoinedEventId[index] = new ObjectId(resultFromSession.listJoinedEventId[index]);
            }
            query = {
                _id: {
                    $in: resultFromSession.listJoinedEventId
                }
            }
            eventService.collection.find(query).toArray().then((result)=> {
                let records = []
                result.forEach((rec) => {
                    records.push({
                        title: rec.title,
                        time: rec.timeHeld,
                        participantCount: rec.participantId.length,
                        volunteerCount: rec.peopleId.length
                    })
                })
                callback(records);
            })
        }
    });
}


function getVolunteering(userid, callback = (records = [])=>{}) {
    let query = {_id: new ObjectId(userid)};
    sessionService.collection.findOne(query, (err, resultFromSession) => {
        let length  = resultFromSession.listEventsCreatedId;
        if(length == 0) {
            callback([]);
        }else{
            for (let index = 0; index < length; index++) {
                resultFromSession.listEventsCreatedId[index] = new ObjectId(resultFromSession.listEventsCreatedId[index]);
            }
            query = {
                _id: {
                    $in: resultFromSession.listEventsCreatedId
                }
            }
            eventService.collection.find(query).toArray().then((result)=> {
                new Promise((resolve, reject) => {
                    let records = [];
                    result.forEach((eventElement, index)=> {
                        if(eventElement.peopleId.length > 0) {
                            sessionService.collection.find({
                                listJoinedEventId: {
                                    $elemMatch: {
                                        eventId: new ObjectId(eventElement._id)
                                    }
                                }
                            }).toArray().then((data)=> {
                                data.forEach(({username, listJoinedEventId}) =>{
                                    let rowData = {
                                        username: username,
                                        eventTitle: result[index].title
                                    }
                                    rowData.volunteeringType = (() => {
                                        for(let i = 0; i< listJoinedEventId.length; i++) {
                                            if((""+listJoinedEventId[i].eventId) == (""+eventElement._id)) {
                                                return listJoinedEventId[i].type;
                                            }
                                        }
                                    })()
                                    records.push(rowData);
                                })
                                if(index == result.length - 1) {
                                    setTimeout(()=> {
                                        resolve(records);
                                    }, 100);
                                }
                            })

                        }
                    })
                }).then((value = []) => {
                    callback(value);
                })
            })
        }
    });
}


function getEventCreated(userid, callback = (records = [])=>{}) {
    let query = {event_author: userid};

    eventService.collection.find(query).toArray().then((element)=> {
        let records = [];
        element.forEach(({title, place, timeHeld, participantId, peopleId})=> {
            records.push({
                title: title,
                place: place,
                time : timeHeld,
                participantCount: participantId.length,
                peopleId: peopleId.length
            })
        });
        callback(records)
    })
}

module.exports = {
    getEventCreated: getEventCreated,
    getVolunteering: getVolunteering,
    getJoinedRecords: getJoinedRecords 

}