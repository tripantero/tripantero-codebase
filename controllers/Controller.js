const app = require('../server').app;
const bodyParser = require('body-parser');

class Controller {
    constructor(url = "/", filename){
        this.middlewares = [];
        this.middlewares.push(require('../middleware/templater'));
        this.method = filename.split('.')[1]
        this.url = url;
        this.errorHandler = (err, request, response, next) => {
            response.status(500);
            response.send("Error: 500");
        }
        this.controller = (request, response) => {
            response.send("it works from: "+this.url);
        };
    }

    enableBodyparser(){
        this.middlewares.push(bodyParser.json());
        this.middlewares.push(bodyParser.urlencoded({extended: false}));
    }

    setController(controller){
        this.controller = controller;
    }
    
    setup(){
        console.log("Applying middleware in "+this.url);
        console.log("   there is "+ this.middlewares.length +" exist middleware.");
        this.middlewares.forEach((middleware)=>{
            app.use(this.url, middleware);
        })

        if(this.method == "get"){
            app.get(this.url, this.controller);
        } else if(this.method == "delete"){
            app.delete(this.url, this.controller);
        } else if(this.method == "post"){
            app.post(this.url, this.controller);
        } else if(this.method == "patch"){
            app.patch(this.url, this.controller);
        } else {
            console.log("\x1b[31m   You are some fucking bitch, you just have four http verbs bitch. go check this out a pil of shit.")
        }

        console.log("\x1b[32m   Setup "+this.url + " controller successed\x1b[37m");
        this.middlewares = [];
    }
}
module.exports = {};
module.exports.Controller = Controller;