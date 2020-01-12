const Controller = new(require('./Controller').Controller)('/home', __filename);

let functional = (request, response) => {
    response.send("You are logged in");
};

Controller.setController(functional);
Controller.setup();