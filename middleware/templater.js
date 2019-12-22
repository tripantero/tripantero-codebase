module.exports = (request, response, next) => {   
    response.render = (directory, data = {}) => {
        let template = require(`../public/views/${directory}/index.marko`);
        response.marko(template, data);
    };
    next();
};
