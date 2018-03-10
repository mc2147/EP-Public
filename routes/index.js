// var bodyParser = require('body-parser');
var globals = require('../globals')
var express = require('express');
var router = express.Router();

router.get('/', function(req, res
	// , next
	) {
	// if (err) return next(err);
	res.render('main', 
	{
		ETypes: globals.Exercise_Types,
		Test: 'Testing'
	});
});

module.exports = router;