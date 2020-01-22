const Controller = new(require('./Controller').Controller)('/', __filename);
const Session = require('../service/session.service');
let functional = (request, response) => {
    if(request.session.key) {
        return Session.findOne({sessionID: request.session.key}, (err, docs) => {
            if(err)  {
                request.session.destroy();
                return response.redirect('/')
            }
            response.render("index", {
                username: docs.username
            });
        })
    }
    response.render("index")
};

Controller.setController(functional);
Controller.setup();