const Controller = new(require('./Controller').Controller)('/startupranking1023084304546101.html', __filename);


let functional = (request, response) => {
    response.send('startupranking-site-verification: startupranking1023084304546101.html');
};

Controller.setController(functional);
Controller.setup();