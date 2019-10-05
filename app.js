require('marko/node-require').install();
require('marko/express');

const express = require('express');
const app = express();
const Server = require('http').createServer(app);

let isProduction = process.env.NODE_ENV == 'production';
require('lasso').configure({
    plugins: [
        'lasso-marko'
    ],
    outputDir: __dirname +'/public/static',
    bundlingEnabled: isProduction,
    minify: isProduction
});

if(!isProduction) {
    app.use(require('morgan')('dev'))
}
app.use(express.static('public/assets/'))
module.exports.app = app;
app.use(require('lasso/middleware').serveStatic());

require('./controllers/controller').Caller();
require('./socket').apply(Server);

Server.listen(process.env.PORT || 6007, ()=>{
    console.log('Successed running');
})