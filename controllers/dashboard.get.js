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
                resolve({
                    linkData: []
                })
            }
        }).then((data)=> {
            globalData = {
                ...globalData,
                linkData: data.linkData
            }
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
        if(resultFromSession.listJoinedEventId.length == 0) {
            callback([]);
        }else{
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
                        participantCount: rec.participantId.length
                    })
                })
                callback(records);
            })
        }
    });
}

Controller.setController(functional);
Controller.setup();