require('dotenv').config();
require('marko/node-require').install();
require('marko/express');

const express = require('express');
const app = express();
const Server = require('http').createServer(app);
const session = require('express-session');

let isProduction = process.env.NODE_ENV == 'production';

require('lasso').configure({
    "outputDir": "static",
    "urlPrefix": __dirname +'/public/assets/static',
    "minify": isProduction,
    "bundlingEnabled": isProduction,
    "fingerprintsEnabled": isProduction,
    "plugins": [
        "lasso-marko"
    ]
});

if(!isProduction) {
    app.use(require('morgan')('dev'))
}
module.exports.app = app;
app.use(session({
    secret: "Tripantero-c0h7a5i9",
    resave: false,
    cookie:{
        secure: true
    }
}))
app.use(require('lasso/middleware').serveStatic());

require('./auxiliary/caller').Caller('controllers', ['Controller']);

Server.listen(process.env.PORT || 6007, ()=>{
    console.log('Successed running');
})