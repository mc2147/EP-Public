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
    var allWorkoutJSONs = data.AllWorkouts;
    
var globalFuncs = require('../globals/functions');
	var getMax = globalFuncs.getMax;
	var getWeight = globalFuncs.getWeight;
	var getWorkoutDates = globalFuncs.getWorkoutDays;
    var G_getPattern = globalFuncs.getPattern;
    
var globalEnums = require('../globals/enums');
    var DaysofWeekDict = globalEnums.DaysofWeekDict;
    
var workoutHandlers = require('../routes/workoutHandlers');
	var saveWorkout = workoutHandlers.saveWorkout;
    
router.get("/test", function(req, res) {
    res.json("test");
});

router.post("/:username/login", async function (req, res) {
    var username = req.params.username;
    var passwordInput = req.body.password;
    var loginUser = await User.findOne({
        where: {
            username,
        }
    });

    if (!loginUser) {
        res.json({
            Status: "No user found"
        });
    }
    else {
        var hashed = loginUser.generateHash(passwordInput, loginUser.salt);
        if (hashed == loginUser.password) {
            res.json({
                Status: "Success"
            });
        }
        else {
            res.json({
                Status: "Incorrect Password!"
            });
        }
    }
})

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
    var input = req.body;
    console.log("91", input);
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
    
    var dateSplit = input.startDate.split("-");
    var dateNow = Date.now();
    input.dateObj1 = Date.parse(input.startDate);
    input.dateObj2 = new Date(
        parseInt(dateSplit[0]), 
        parseInt(dateSplit[1] - 1), 
        parseInt(dateSplit[2] - 1)); 
    input.dateObj3 = dateNow;
    input.dateObj4 = new Date(Date.now());
    var daysList = [
        parseInt(input["Day-1"]),
        parseInt(input["Day-2"]),
        parseInt(input["Day-3"]),
    ];
    var Level = parseInt(input.workoutLevel); //Determine N Workouts based on that
    var Group = 0;
    var Block = parseInt(input.workoutBlock);
    var TemplatesJSON = {};
    input.level = Level;
    if (Level <= 5) {
        Group = 1;
        TemplatesJSON = allWorkoutJSONs[Group];
    }
    else if (Level <= 10) {
        Group = 2;
        TemplatesJSON = allWorkoutJSONs[Group];
        daysList.push(parseInt(input["Day-4"]));
    }
    else if (Level <= 16) {
        Group = 3;
        // Block = "a";
        TemplatesJSON = allWorkoutJSONs[Group][Block];
        daysList.push(parseInt(input["Day-4"]));
    }
    else {
        Group = 4;
        // Block = "a";
        TemplatesJSON = allWorkoutJSONs[Group][Block];
        daysList.push(parseInt(input["Day-4"]));
    }
    var nWorkouts = Object.keys(TemplatesJSON.getWeekDay).length;
    input.nWorkouts = nWorkouts;
    input.daysList = daysList;
    
    var workoutDates = getWorkoutDates(input.dateObj2, daysList, Level, "", nWorkouts);
    input.workoutDates = workoutDates;
    input.detailedworkoutDates = [];
    workoutDates.forEach((elem) => {
        var item = [elem];
        item.push(DaysofWeekDict[elem.getDay()]);
        input.detailedworkoutDates.push(item);
    });
    var Templates = TemplatesJSON.Templates;
    input.workouts = {};
    for (var W in Templates) {
        var thisWeek = Templates[W];
        for (var D in thisWeek) {
            var ID = thisWeek[D].ID;
            input.workouts[ID] = {
                ID: null,
                Week: null,
                Day: null,
                Date: null,
                Completed: false,
                Patterns: [],
            };                 
            input.workouts[ID].Week = W;
            input.workouts[ID].Day = D;
            input.workouts[ID].ID = ID;
            var thisworkoutDate = workoutDates[ID - 1];
            input.workouts[ID].Date = thisworkoutDate;
            }
    }
    _User.workouts = input.workouts;
    _User.currentWorkoutID = 1;
    _User.workoutDates = workoutDates;
    _User.resetStats = true;
    await _User.save();
    res.json({input, updatedUser: _User, session: {
        viewingWID: 1,
        User: _User,
        username: _User.username,
        userId: _User.id,
    }});
}) 

router.get("/:userId/videos", async function(req, res) {
    var videosUser = await User.findById(req.params.userId);
    var videos = VideosVue(VideosJSON, videosUser.level);
    res.json(videos);
})



module.exports = router;