const Controller = new(require('./Controller').Controller)('/login', __filename);

let functional = (request, response) => {
    response.render("login", {});
};

Controller.setController(functional);
Controller.setup();