require('marko/node-require').install();
require('marko/express');

const express = require('express');
const app = express();
const Server = require('http').createServer(app);
const session = require('express-session');
const client = require('redis').createClient(process.env.REDISCLOUD_URL, {no_ready_check: true});
const redisStore = require('connect-redis')(session);
const PORT = process.env.PORT || 6007;

let isProduction = process.env.NODE_ENV == 'production';

require('lasso').configure({
    "outputDir": "public/static",
    "urlPrefix": '/public/assets/static',
    "minify": isProduction,
    "bundlingEnabled": isProduction,
    "fingerprintsEnabled": isProduction,
    "plugins": [
        "lasso-marko"
    ]
});

module.exports.app = app;
app.use(session({
    secret: "Tripantero-c0h7a5i9",
    resave: true,
    saveUninitialized: true,
    store: new redisStore({
        client: client,
    })
}))
app.use(require('lasso/middleware').serveStatic());
app.use('/images', express.static("public/assets/images/"))
require('./auxiliary/caller').Caller('controllers', ['Controller']);

Server.listen(PORT, ()=>{
    console.log('Successed running on port: '+PORT);
})
