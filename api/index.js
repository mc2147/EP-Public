var Promise = require("bluebird");
var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
var models = require('../models');

var data = require('../data');

console.log("API FILE 9");

var RPETable = data.RPETable;
var Exercises = data.ExerciseDict;

var workoutTemplates = {};
workoutTemplates[1] = data.Workouts1;
workoutTemplates[2] = data.Workouts2;

router.get('/workout-templates/:LGroup', function(req, res) {
    console.log("req params: ", req.params);
    var LGroup = parseInt(req.params.LGroup);
    if (LGroup in workoutTemplates) {
        res.json(workoutTemplates[LGroup]);
    }
    else {
        res.json({});
    }
});

router.get('/exercises', function(req, res) {
    res.json(Exercises);
    // console.log("req params: ", req.params);
});

router.get('/rpe-table', function(req, res) {
    res.json(RPETable);
    // console.log("req params: ", req.params);
});


module.exports = router;