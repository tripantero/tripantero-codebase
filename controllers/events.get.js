const Controller = new(require('./Controller').Controller)('/events', __filename);
const Event = require('../service/event.service');

let data = {
    event_author: "Hahu Lilomang",
    title: "Bali",
    description: "lorem ipsum dolor sit amet e massa fac facilisis vel illum dolore e d angles et quasi architecto singledata quisque penatibus et magnis dis parturient montes dolore directory sit amet e massa facilisis vel illum dolore e d angles et",
    image_url: "https://i.ytimg.com/vi/2b9txcAt4e0/maxresdefault.jpg",
    timeHeld: new Date(),
    date_created: new Date(),
    participantId: ["24", "2", "3", "4", "5", "6", "7", "8"],
    peopleId: ["4", "5", "6", "7", "8", "9", "10"]
}

let functional = (request, response) => {
    Event.find({}, (err, events) => {
        response.render("events", {events});
    });
};

Controller.setController(functional);
Controller.setup();