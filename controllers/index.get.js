const Controller = new(require('./Controller').Controller)('/', __filename);

let functional = (request, response) => {
    response.render("index")
};

Controller.setController(functional);
Controller.setup();