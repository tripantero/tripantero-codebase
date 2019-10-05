require('marko/node-require').install();
require('marko/express');

const express = require('express');
const app = express();
const http = require('http');
const Server = http.createServer(app);

let isProduction = process.env.NODE_ENV == 'production';
require('lasso').configure({
    plugins: [
        'lasso-marko'
    ],
    outputDir: __dirname +'/public/assets/static',
    bundlingEnabled: isProduction,
    minify: isProduction
});

module.exports.app = app;
app.use(require('lasso/middleware').serveStatic());

require('./controllers/controller').Caller();


require('./socket').apply(http);

Server.listen(process.env.PORT || 6007, ()=>{
    console.log('Successed running');
})