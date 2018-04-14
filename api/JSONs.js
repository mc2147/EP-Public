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
    var DescriptionsJSON = data.DescriptionsJSON;

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
    res.json(workoutTemplates);
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
    // User.findOne({
    //     where: {
    //         id: req.params.userId,
    //     }
    // })    
    User.findById(1).then((user) => {
        // res.json(user.stats);
        res.json(user.workouts);
    })
    console.log("25");
    // res.json(W3a);
});

router.get('/user/:userId/stats', function(req, res) {
    var userId = req.params.userId;
    User.findById(userId).then((user) => {
        // res.json(user.workouts);
        res.json(user.stats);
    })
    // console.log("25");
    console.log("USER STATS");
})

function vueStats(JSON) {
    output = [];
    for (var EType in JSON) {
        if (EType != "Level Up") {
            output.push(getVueStat(EType, JSON[EType]));
        }
    }
    return output;
}

router.get('/user/:userId/stats/vue/get', function(req, res) {
    var userId = req.params.userId;
    User.findById(userId).then((user) => {
        var JSONStats = user.stats;
        for (var statKey in JSONStats) {
            console.log(statKey);
        }
        console.log(JSONStats);
        // res.json(user.workouts);
        var vueData = {
            level: user.level,
            exerciseTableItems: vueStats(JSONStats),
        }
        res.json(vueData);
    })
    // console.log("25");
    console.log("USER STATS");
})

function getVueStat(EType, JSONStat) {
    var vueStat = {
        value:false,
    };
    vueStat.exerciseType = EType;
    vueStat.exerciseName = JSONStat.name;
    vueStat.max = JSONStat.Max;
    if (JSONStat.Status.value == 1) {
        vueStat.alloyResult = "PASSED";
    }
    else if (JSONStat.Status.value == -1) {
        vueStat.alloyResult = "FAILED";
    }
    else {
        vueStat.alloyResult = "---";
    }
    return vueStat;
}

function vueProgress(JSONStats) {
    var output = {
        coreExerciseTableItems: [],
        secondaryExerciseTableItems: [],
    };
    output.coreExerciseTableItems.push(getVueStat("UB Hor Push", JSONStats["UB Hor Push"]));
    output.coreExerciseTableItems.push(getVueStat("Squat", JSONStats["Squat"]));
    output.coreExerciseTableItems.push(getVueStat("Hinge", JSONStats["Hinge"]));
    
    for (var EType in JSONStats) {
        if (EType != "UB Hor Push" && EType != "Squat" && EType != "Hinge"
        && EType != "Level Up")
        output.secondaryExerciseTableItems.push(getVueStat(EType, JSONStats[EType]));        
    }
    return output;
}

router.get('/user/:userId/progress/vue/get', function(req, res) {
    var userId = req.params.userId;
    console.log("USER PROGRESS VUE");
    User.findById(userId).then((user) => {
        var JSONStats = user.stats;
        for (var statKey in JSONStats) {
            console.log(statKey);
        }
        // console.log(JSONStats);
        // res.json(user.workouts);
        var vueData = vueProgress(JSONStats);
        vueData.level = user.level;
        res.json(vueData);
    })
})

router.get('/json/exercises', function(req, res) {
    res.json(Exercises);
    // console.log("req params: ", req.params);
});

router.get('/json/rpe-table', function(req, res) {
    res.json(RPETable);
    // console.log("req params: ", req.params);
});


module.exports = router;