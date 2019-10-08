const Controller = new (require('./Controller').Controller)('/', __filename);

let functional = (request, response)=>{
    response.render("index", {
        count: 10
    });
};

Controller.setController(functional);
Controller.setup();