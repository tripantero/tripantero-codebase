const session = require('../service/session.service');

module.exports = (request, response, next) => {
    response.render = (directory, data = {}) => {
        let template = require(`../public/views/${directory}/index.marko`);
        
        getUsername(request.session.key).then((username)=>{
            response.marko(template, {
                username: username,
                ...data
            });
        })
    };
    next();
};

function getUsername(key) {
    return new Promise((resolve, reject) => {
        session.findOne({sessionID: key || "only null"}, (err, docs)=> {
            if(err) {
                console.log("Error here please fix me");
            }
            let data = docs || {username: null};
            resolve(data.username);
        })
    })
}