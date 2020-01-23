const session = require('../service/session.service');

module.exports = (request, response, next) => {
    let key = request.session.key;
    changeState(response.render || response.marko, key);
    next();
}

function changeState(renderFunction, key) {
    session.findOne({sessionID: key || "only null"}, (err, docs)=> {
        if(err) {
            return console.log("Error here please fix me");
        }

        renderFunction = (template, data = {}) => {
            data = Object.assign(data, docs.username);
            renderFunction(template, data);
        }
    })
}