const route = require('./controller').Api;
let API = new route('/', __filename);

let controller = (request, response)=>{
    response.render("index", {
        count: 10
    });
};

API.setController(controller);
API.setup();