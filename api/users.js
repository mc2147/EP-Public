const session = require('express-session');
var Promise = require("bluebird");
var bodyParser = require('body-parser');
var express = require('express');
const bcrypt    = require('bcryptjs');

var router = express.Router();
var models = require('../models');
	var Exercise = models.Exercise;
	var WorkoutTemplate = models.WorkoutTemplate;
	var SubWorkoutTemplate = models.SubWorkoutTemplate;
	var Workout = models.Workout;
	var User = models.User;

var data = require('../data');
    var W3a = data.AllWorkouts[3]["a"];
    var RPETable = data.RPETable;
    var Exercises = data.ExerciseDict;
    var VideosJSON = data.VideosJSON;
    var VideosVue = data.VideosVue;
    var DescriptionsJSON = data.DescriptionsJSON;

router.get("/test", function(req, res) {
    res.json("test");
});

router.put("/:userId", function(req, res) {
    User.findById(req.params.userId).then((user) => {
        user.update(req.body).then(user => res.json(user));
    });
})

router.put("/:userId/stats", function(req, res) {
    User.findById(req.params.userId).then((user) => {
        user.update(
            {
                stats:req.body,
            }            
        ).then(user => res.json(user));
    });
})

router.put("/:userId/workouts", function(req, res) {
    User.findById(req.params.userId).then((user) => {
        user.update(
            {
                workouts:req.body,
            }            
        ).then(user => res.json(user));
    });
})

router.post("/:userId/oldstats", function(req, res) {
    User.findById(req.params.userId).then((user) => {
        user.oldstats.push(req.body);
        user.changed('oldstats', true);
        user.save().then(user => res.json(user));
    });
})


module.exports = router;

