const session = require('../service/session.service');

module.exports = (request, response, next) => {
    response.render = (directory, data = {}) => {
        let template = require(`../public/views/${directory}/index.marko`);
        getUsername(request.session.key).then((datas)=>{
            request.session._id = data._id
            response.marko(template, {
                id: datas._id,
                username: datas.username,
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
            let data = {
                _id: null,
                username: null
            };
            if(docs == null) {
                return resolve(data);
            }
            let username = docs.username || null;
            let id = docs._id || null;
            data = {
                _id: id,
                username: username
            };
            resolve(data);
        })
    })
}