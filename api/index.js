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
    var W3a = data.AllWorkouts[3]["a"];
    var RPETable = data.RPETable;
    var Exercises = data.ExerciseDict;
    var VideosJSON = data.VideosJSON;
    var VideosVue = data.VideosVue;

// var WorkoutGenerator = require('../data/WorkoutGenerator');
// console.log("API FILE 9");


var workoutTemplates = {};
workoutTemplates[1] = data.Workouts1;
workoutTemplates[2] = data.Workouts2;

// router.get("/templates/3a", function(req, res) {
//     console.log("25");
//     res.json(W3a);
// });
router.get("/exercises", function(req, res) {
    Exercise.findAll({
        where:{},
    }).then(exercises => {
        res.json(exercises);
    })
});

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
    WorkoutTemplate.findAll({
        where:{},
        include: [
            { model: SubWorkoutTemplate, as: 'subWorkouts', required: true}
        ],
    }).then(result => {
        console.log("result", result);
        res.json(result)
    })
});

router.get('/SubWorkoutTemplate', function(req, res) {
    console.log("req params: ", req.params);
    SubWorkoutTemplate.findAll({where:{}}).then(result => {
        res.json(result)
    })
});


router.get('/json/workout-templates/:LGroup', function(req, res) {
    console.log("req params: ", req.params);
    var LGroup = parseInt(req.params.LGroup);
    if (LGroup in workoutTemplates) {
        res.json(workoutTemplates[LGroup]);
    }
    else {
        res.json({});
    }
});

router.get('/json/videos', function(req, res) {
    res.json(VideosJSON);
})

router.get('/json/videos/vue-api', function(req, res) {
    res.json(VideosVue(VideosJSON, 1));
})

router.get('/videos/vue-api', function(req, res) {
    console.log("VIDEOS");
})


router.post('/videos/post', function(req, res) {
    
})


router.get("/user/:userId/workouts", function(req, res) {
    var userId = req.params.userId;
    User.findOne({
        where: {
            id: req.params.userId,
        }
    }).then((user) => {
        res.json(user.workouts);
    })
    console.log("25");
    // res.json(W3a);
});


router.get('/json/exercises', function(req, res) {
    res.json(Exercises);
    // console.log("req params: ", req.params);
});

router.get('/json/rpe-table', function(req, res) {
    res.json(RPETable);
    // console.log("req params: ", req.params);
});


module.exports = router;