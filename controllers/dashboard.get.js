const Controller = new(require('./Controller').Controller)('/dashboard?', __filename);
const validator = require('../middleware/session-validator');
const eventService = require('../service/event.service');
const sessionService = require('../service/session.service');
const { ObjectId } = require('mongodb');
Controller.middlewares.push(validator);


let functional = (request, response) => {
    if(request.session.role == "businessman") {
        let tabs=[{label: "Event Created", link: "created"}, {label: "Volunteering", link: "request"}, {label: "Joined Event", link: "joined"}];
        let link = request.query.page || "joined";
        let highlight = 0;
        tabs.forEach(element => {
            if(element.link == link) {
                highlight = tabs.indexOf(element);
            }
        }); 
        let globalData = {
            tabs: tabs,
            highlight: highlight,
            link: link
        }
        new Promise((resolve, reject) => {
            if(link == "joined") {
                getJoinedRecords(request.session._id, (records) => {    
                    resolve({
                        linkData: records
                    });
                })
            } else if(link == "request") {
                getVolunteering(request.session._id, (records) => {
                    resolve({
                        linkData: records
                    })
                })
            } else if(link == "created") {
                getEventCreated(request.session._id, (records) => {
                    resolve({
                        linkData: records 
                    })
                });
            }
        }).then((data)=> {
            globalData.linkData = data.linkData
            response.render("dashboard/businessman", globalData);
        })
    } else if(request.session.role == "localpeople"){
        return response.render("dashboard/localpeople");
    } else {
        response.send("We does not recognize your role");
    }
};

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
        }ObjectId()
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

Controller.setController(functional);
Controller.setup();