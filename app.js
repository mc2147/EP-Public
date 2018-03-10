const express = require( 'express' );
const app = express(); // creates an instance of an express application
var nunjucks = require('nunjucks');
var routes = require('./routes');
var bodyParser = require('body-parser');


// app.get('/', (req, res) => res.send('New Alloy Strength'))

app.use('/', routes);

app.set('view engine', 'html'); // have res.render work with html files
app.engine('html', nunjucks.render); // when giving html files to res.render, tell it to use nunjucks
nunjucks.configure('views', { noCache: true });

app.use(bodyParser.urlencoded({ extended: true })); // for HTML form submits
app.use(bodyParser.json()); // would be for AJAX requests

app.listen(3000, () => console.log('Alloy Strength on port ' + 3000))