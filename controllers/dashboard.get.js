const Controller = new(require('./Controller').Controller)('/dashboard?', __filename);
const validator = require('../middleware/session-validator');
const {getEventCreated, getJoinedRecords, getVolunteering} = require('../service/dashboard/business')
const {peopleGetJoinedRecords} = require('../service/dashboard/people')
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
        let tabs=[{label: "Joined Event", link: "joined"}];
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
        peopleGetJoinedRecords(request.session._id, (records) => {
            globalData.linkData = records
            response.render("dashboard/localpeople", globalData);
        })
    } else {
        response.send("We does not recognize your role");
    }
};



Controller.setController(functional);
Controller.setup();