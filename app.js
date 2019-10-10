require('dotenv').config();
require('marko/node-require').install();
require('marko/express');

const express = require('express');
const app = express();
const Server = require('http').createServer(app);

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
app.use(require('lasso/middleware').serveStatic());

require('./controllers/Controller').Caller();
require('./socket').apply(Server);

Server.listen(process.env.PORT || 6007, ()=>{
    console.log('Successed running');
})