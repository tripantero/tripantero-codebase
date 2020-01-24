const Controller = new (require('./Controller').Controller)('/logout', __filename);
const authService = require('../service/session.service');

let functional = (request, response) => {
    let sessionID = request.session.key;
    authService.update({
        sessionID: sessionID
    }, {
        $set: {
            sessionID: "",
            lastLogout: new Date()
        }
    });
    request.session.destroy(()=> {
        response.redirect('/');
    })
};

Controller.setController(functional);
Controller.setup();