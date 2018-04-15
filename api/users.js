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

var workoutHandlers = require('../routes/workoutHandlers');
	var saveWorkout = workoutHandlers.saveWorkout;
    
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

router.put("/:userId/save-workout", async function(req, res) {
    console.log("save-workout put: ", req.body);
    var updateUser = await User.findById(req.params.userId);
    var body = req.body;    
    await saveWorkout(body.submission, updateUser, body.viewingWID);
    res.json(req.body);
})

router.put("/:userId/submit-workout", async function(req, res) {
    console.log("submit-workout put: ", req.body);
    var updateUser = await User.findById(req.params.userId);
    var body = req.body;    
    await saveWorkout(body.submission, updateUser, body.viewingWID, true);
    if (parseInt(body.viewingWID) == updateUser.workoutDates.length) {
        console.log("LEVEL CHECK! ", body.viewingWID);
        var levelUpStats = updateUser.stats["Level Up"];
        if (!levelUpStats.Status.Checked && levelUpStats.Status.value == 1) {
            updateUser.level ++;
        }
        updateUser.stats["Level Up"].Status.Checked = true;
        updateUser.changed( 'stats', true);
        await updateUser.save();
    }
    res.json(req.body);
})

router.post("/:userId/get-next-workouts", async function(req, res) {
    console.log("91", req.body);
    var _User = await User.findById(req.params.userId);
    var _oldStat = {
        addLater : "Finish date, alloy pass/fail, level",
        finishDate : "",
        level : _User.level,
    };
    _oldStat.statDict = _User.stats
    _User.oldstats.push(_oldStat);
    _User.changed( 'oldstats', true);
    await _User.save();
    
    res.json(req.body);
}) 

router.get("/:userId/videos", async function(req, res) {
    var videosUser = await User.findById(req.params.userId);
    var videos = VideosVue(VideosJSON, videosUser.level);
    res.json(videos);
})



module.exports = router;