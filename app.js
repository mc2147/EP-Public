const express = require( 'express' );
const app = express(); // creates an instance of an express application
var nunjucks = require('nunjucks');
var routes = require('./routes');
var bodyParser = require('body-parser');
var history = require('connect-history-api-fallback');
var cors = require('cors');

var loadData = require('./loadData');

// app.get('/', (req, res) => res.send('New Alloy Strength'))
app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json()); // would be for AJAX requests
app.use(cors());

// var thisUser = await User.findById(1).then(user => {
// 	console.log("USER FOUND!!! USER ID: " + user.id);
// 	console.log("User's stats: ");
// 	console.log(user.stats);
// 	thisUser = user;
// 	userFound = true;
// });

app.use('/api', require('./api'));

app.use('/', routes);

app.set('view engine', 'html'); // have res.render work with html files
app.engine('html', nunjucks.render); // when giving html files to res.render, tell it to use nunjucks
nunjucks.configure('views', { noCache: true });

var models = require('./models');
var generateTemplates = require('./models/generateTemplates');
var createUser = require('./models/createUser');

models.db.sync()
.then(function () {
    console.log('All tables created!');
    app.listen(3000, function () {
        console.log('Server is listening on port 3000!');
    });
})
.catch(console.error.bind(console));

// app.listen(3000, () => console.log('Alloy Strength on port ' + 3000))