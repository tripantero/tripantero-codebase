const Controller = new(require('./Controller').Controller)('/', __filename);

view = require("../public/views/landing-page/index.marko")

let functional = (request, response) => {
    response.render("index", {
        view: view.render({})
    });
};

Controller.setController(functional);
Controller.setup();