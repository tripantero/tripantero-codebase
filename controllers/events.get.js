const Controller = new(require('./Controller').Controller)('/events', __filename);

let functional = (request, response) => {
    response.render("events", {});
};

Controller.setController(functional);
Controller.setup();