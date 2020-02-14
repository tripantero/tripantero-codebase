const Controller = new(require('./Controller').Controller)('/dashboard', __filename);
const validator = require('../middleware/session-validator');
Controller.middlewares.push(validator);


let functional = (request, response) => {
    if(request.session.role == "businessman") {
        return response.render("dashboard/businessman");
    } else if(request.session.role == "localpeople"){
        return response.render("dashboard/localpeople");
    }
    response.send("We does not recognize your role");
};

Controller.setController(functional);
Controller.setup();