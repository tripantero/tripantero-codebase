const Controller = new (require('./Controller').Controller)('/events', __filename);
const eventServ = require('../service/event.service');
const userServ = require('../service/session.service');
const direct = require('../middleware/session-validator');
const upload = require("express-fileupload");
const fs = require('fs');

Controller.middlewares.push(direct);
Controller.middlewares.push(upload());
Controller.enableBodyparser();

let functional = (request, response) => {
    userServ.findOne({sessionID: request.session.key}, (err, docs) => {
        if(err) return console.log(err);
        if(docs == {} || docs == null) {
            return response.redirect('/');
        }
        let type = request.files.imageurl.name.split(".");
        let filename = request.files.imageurl.md5 + "." + type[type.length - 1];
        let data = {
            event_author: ""+docs._id,
            title: request.body.title,
            description: request.body.content,
            image_url: `/images/${filename}`,
            timeHeld: request.body.timeHeld,
            date_created: Date.now(),
            participantId: [],
            peopleId: []
        };

        fs.writeFile("public/assets/images/"+filename, request.files.imageurl.data, (err) => {
            if (err) return response.send("something error with message: "+err);
            eventServ.save(data);
            response.redirect('/events');
        });
    })
};

Controller.setController(functional);
Controller.setup();

