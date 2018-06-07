// Live deployment: onlineVersion && herokuLocal
// Heroku Local: !onlineVersion && herokuLocal
// Local local: !onlineVersion && !herokuLocal
let onlineVersion = true;
// let herokuLocal = false;
// Seed bools
// s// False 
let seedWorkouts = false;
let seedUsers = false;
var onlineURL = "https://immense-mesa-37246.herokuapp.com";
// var localURL = (herokuLocal) ? "http://localhost:5000" : "http://localhost:3000";
var localURL = "http://localhost:5000";

var onlineCORS = 'http://alloystrength.s3-website-us-east-1.amazonaws.com';
var localCORS = "http://localhost:8080";

console.log("process.env.PORT: ", process.env.PORT);
console.log("LINE 10 APP.JS");

process.env.BASE_URL = (process.env.PORT && onlineVersion) ? onlineURL : localURL;
process.env.CORS_ORIGIN = (process.env.PORT && onlineVersion) ? onlineCORS : localCORS;
process.env.STRIPE_SECRET_KEY = 'sk_test_5wRrRkW71NRhb4cIHdRL9Z32';
process.env.STRIPE_PUBLIC_KEY = 'pk_test_uecJvlGuK94TACv9jW9XxmVg';
// LIVE KEYS
// Secret: sk_live_OXwkp7SjAleSx9u6QLlUns0U
// Public: pk_live_PWmtkdqxq5DvLLcRz298lZQs
// TEST KEYS
// Secret: sk_test_5wRrRkW71NRhb4cIHdRL9Z32
// Public: pk_test_uecJvlGuK94TACv9jW9XxmVg

console.log("process.env.   BASE_URL SET: ", process.env.BASE_URL);

const path = require('path');
var api = require('./api');
var models = require('./models');
if (seedWorkouts) {
    var generateTemplates = require('./models/generateTemplates');
}
    
const express = require( 'express' );
const session = require('express-session');
const app = express(); // creates an instance of an express application
var nunjucks = require('nunjucks');
var routes = require('./routes');
var bodyParser = require('body-parser');
var history = require('connect-history-api-fallback');
var cors = require('cors');

var loadData = require('./data');

console.log("line 27 app.js");
// app.get('/', (req, res) => res.send('New Alloy Strength'))

app.use(bodyParser.json()); // would be for AJAX requests
app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits

app.use(session({
    secret: 'ASSecret',
    resave: false,
    saveUninitialized: true,    
    duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
}));
    
    

var allowCrossDomain = function(req, res, next) {
    // if ('OPTIONS' == req.method) {
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');
        // res.send(200);
        next();
    // }
    // else {
    // }
};

app.use(allowCrossDomain);

app.use(function (req, res, next) {
    // console.log('session', req.session);
    next();
});

    
app.use(cors({
    origin:['http://alloystrength.s3-website-us-east-1.amazonaws.com'],
    methods:['GET','POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true, // enable set cookie    
    allowedHeaders: ['Content-Type', 'Authorization', 'Content-Length', 'X-Requested-With']
}));


app.use('/api', api);
        
        
if (seedUsers) {
    var createUser = require('./models/createUser');
}
app.use('/', routes);

app.use(express.static(path.join(__dirname, '..', 'views')))

app.set('view engine', 'html'); // have res.render work with html files

app.engine('html', nunjucks.render); // when giving html files to res.render, tell it to use nunjucks


nunjucks.configure('views', { noCache: true });


models.db.sync()
.then(function () {
    console.log('All tables created!');
    app.listen(process.env.PORT || 5000, function () {
        console.log('Server is listening on port 5000!');
    });
})
.catch(console.error.bind(console));

