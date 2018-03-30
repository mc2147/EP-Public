var Promise = require("bluebird");
var bodyParser = require('body-parser');
var express = require('express');
var router = express.Router();
var models = require('../models');
	var Exercise = models.Exercise;
	var WorkoutTemplate = models.WorkoutTemplate;
	var SubWorkoutTemplate = models.SubWorkoutTemplate;
	var Workout = models.Workout;
	var User = models.User;

var data = require('../data');
var WorkoutGenerator = require('../data/WorkoutGenerator');
var W3a = data.AllWorkouts[3]["a"];
// console.log("API FILE 9");

var RPETable = data.RPETable;
var Exercises = data.ExerciseDict;

var workoutTemplates = {};
workoutTemplates[1] = data.Workouts1;
workoutTemplates[2] = data.Workouts2;

// console.log("W3a", W3a);
router.get("/templates/3a", function(req, res) {
    console.log("25");
    res.json(W3a);
});

router.get("/templates/3b", function(req, res) {
    res.json(data.AllWorkouts[3]["b"]);
});

router.get("/templates/4a", function(req, res) {
    res.json(data.AllWorkouts[4]["a"]);
});

router.get("/templates/4b", function(req, res) {
    res.json(data.AllWorkouts[4]["b"]);
});


router.get('/workout-templates', function(req, res) {
    console.log("req params: ", req.params);
    WorkoutTemplate.findAll({
        where:{

        },
        include: [
            { model: SubWorkoutTemplate, as: 'subWorkouts', required: true}
        ],
    }).then(result => {
        res.json(result)
    })
});

router.get('/SubWorkoutTemplate', function(req, res) {
    console.log("req params: ", req.params);
    SubWorkoutTemplate.findAll({where:{}}).then(result => {
        res.json(result)
    })
});


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