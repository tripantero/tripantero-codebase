const Controller = new(require('./Controller').Controller)('/', __filename);
Controller.middlewares.push(require('../middleware/username-templater'));

let functional = (request, response) => {
    response.render("index")
};

Controller.setController(functional);
Controller.setup();