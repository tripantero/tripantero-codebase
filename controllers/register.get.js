const Controller = new(require('./Controller').Controller)('/register', __filename);

let functional = (request, response) => {
    response.render("register", {});
};

Controller.setController(functional);
Controller.setup();