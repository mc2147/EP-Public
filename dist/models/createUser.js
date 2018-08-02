'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.SetUser = SetUser;
exports.CreateUser = CreateUser;

var _index = require('./index');

var _workoutFunctions = require('../api/apiFunctions/workoutFunctions');

var _generateWorkouts = require('../api/apiFunctions/generateWorkouts');

var axios = require('axios');
// import axios from 'axios';
var Sequelize = require('sequelize');
// var models = require('./index');
// var WorkoutTemplate = models.WorkoutTemplate;
// var SubWorkoutTemplate = models.SubWorkoutTemplate;
// var User = models.User;


var globalFuncs = require('../globals/functions');
var globalEnums = require('../globals/enums');

var getWorkoutDays = globalFuncs.getWorkoutDays;

var data = require('../data');
var Workouts1 = data.Workouts1;
var Workouts2 = data.Workouts2;
var AllWorkouts = data.AllWorkouts;
var ExerciseDict = data.ExerciseDict.Exercises;

var bcrypt = require('bcryptjs');

var saltRounds = 10;
function generateSalt() {
    return bcrypt.genSaltSync(saltRounds);
}

function generateHash(password, salt) {
    return bcrypt.hashSync(password, salt, null);
}

// var thisGroup = Workouts1;

// console.log("assigning workouts:");
var DayValue = 24 * 3600 * 1000;

var Alloy = globalEnums.Alloy;

var StatTemplate = {
    "UB Hor Push": { Status: Alloy.None, Max: 200, LastSet: "", Name: "" },
    "UB Vert Push": { Status: Alloy.None, Max: 200, LastSet: "", Name: "" },
    "UB Hor Pull": { Status: Alloy.None, Max: 200, LastSet: "", Name: "" },
    "UB Vert Pull": { Status: Alloy.None, Max: 200, LastSet: "", Name: "" },
    "Hinge": { Status: Alloy.None, Max: 100, LastSet: "", Name: "" },
    "Squat": { Status: Alloy.None, Max: 100, LastSet: "", Name: "" },
    "LB Uni Push": { Status: Alloy.None, Max: 100, LastSet: "", Name: "" },
    "Ant Chain": { Status: Alloy.None, Max: 100, LastSet: "", Name: "" },
    "Post Chain": { Status: Alloy.None, Max: 100, LastSet: "", Name: "" },
    "Carry": { Status: Alloy.None, Max: 100, LastSet: "", Name: "" },
    "Iso 1": { Status: Alloy.None, Max: 100, LastSet: "", Name: "" },
    "Iso 2": { Status: Alloy.None, Max: 100, LastSet: "", Name: "" },
    "Iso 3": { Status: Alloy.None, Max: 100, LastSet: "", Name: "" },
    "Iso 4": { Status: Alloy.None, Max: 100, LastSet: "", Name: "" },
    "RFD Load": { Status: Alloy.None, Max: 100, LastSet: "", Name: "" },
    "RFD Unload 1": { Status: Alloy.None, Max: 100, LastSet: "", Name: "" },
    "RFD Unload 2": { Status: Alloy.None, Max: 100, LastSet: "", Name: "" },
    "Medicine Ball": { Status: Alloy.None, Max: 100, LastSet: "", Name: "" },
    "Level Up": {
        Status: Alloy.None,
        Squat: Alloy.None,
        UBHorPush: Alloy.None,
        Hinge: Alloy.None
    }
};

var blankStatTemplate = {
    "UB Hor Push": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "UB Vert Push": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "UB Hor Pull": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "UB Vert Pull": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "Hinge": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "Squat": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "LB Uni Push": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "Ant Chain": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "Post Chain": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "Carry": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "Iso 1": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "Iso 2": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "Iso 3": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "Iso 4": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "RFD Load": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "RFD Unload 1": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "RFD Unload 2": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "Medicine Ball": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
    "Level Up": {
        Status: Alloy.None,
        Squat: Alloy.None,
        UBHorPush: Alloy.None,
        Hinge: Alloy.None
    }
};

// var FilledStatTemplate = {
//     "UB Hor Push": {Status: Alloy.None, Max: 200, LastSet: "", Name: ""}, 
//     "UB Vert Push": {Status: Alloy.None, Max: 200, LastSet: "", Name: ""}, 
//     "UB Hor Pull": {Status: Alloy.None, Max: 200, LastSet: "", Name: ""}, 
//     "UB Vert Pull": {Status: Alloy.None, Max: 200, LastSet: "", Name: ""}, 
//     "Hinge": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""},
//     "Squat": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
//     "LB Uni Push": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
//     "Ant Chain": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
//     "Post Chain": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
//     "Carry": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
//     "Iso 1": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
//     "Iso 2": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
//     "Iso 3": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
//     "Iso 4": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
//     "RFD Load": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
//     "RFD Unload 1": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
//     "RFD Unload 2": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
//     "Medicine Ball": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""},     
//     "Level Up": {
//         Status: Alloy.None, 
//         Squat: Alloy.None,
//         UBHorPush: Alloy.None,
//         Hinge: Alloy.None,
//     },
// };


var WorkoutInstanceTemplate = {
    ID: null,
    Week: null,
    Day: null,
    Date: null,
    Completed: false,
    Patterns: []
};

var oldDate = new Date(Date.now() - 10 * DayValue);
var thisDate = new Date(Date.now());

// CreateUser(1, 1, oldDate);
//CreateUser:
//id, levelGroup, blockNum, level, startDate, workoutDays
//Level Groups 1 to 4, block 1
// "UserName2"


// CreateUser("UserName1", 1, 0, 1, thisDate, [1, 3, 5], true);
// CreateUser("UserName2", 2, 0, 6, thisDate, [1, 2, 3, 5], true);
// CreateUser("UserName3", 3, 1, 11, thisDate, [1, 2, 3, 5], true);
// CreateUser("UserName4", 4, 1, 16, thisDate, [1, 2, 3, 5], true);
// CreateUser("UserName5", 3, 2, 12, oldDate, [1, 2, 3, 5], true);
// CreateUser("UserName6", 4, 2, 16, thisDate, [1, 2, 3, 5], true);
// CreateUser("AdminBryce", 3, 1, 11, thisDate, [1, 2, 3, 5], true, "ABryce274", true, false);
// CreateUser("AdminSterner", 3, 1, 11, thisDate, [1, 2, 3, 5], true, "ASterner368", true, false);

// CreateUser("AdminChan", 3, 1, 11, thisDate, [1, 2, 3, 5], true, "AChan2147", true, true);
// CreateUser("AdminSitwala", 3, 1, 11, thisDate, [1, 2, 3, 5], true, "ASitwala9", true, true);
// CreateUser("mc2147", 3, 1, 11, thisDate, [1, 2, 3, 5], false, "AChan2147", true, false);
// CreateUser("BetaSitwala", 3, 1, 11, thisDate, [1, 2, 3, 5], false, "BSitwala9", true, false);

// CREATING NON-ADMIN BETA TESTERS
//// CreateUser("BetaUser", 2, 0, 6, date, [Day 1, Day 2...], false -> (admin), "Password", false -> (filledStats), false -> defaultWorkouts);
// CreateUser("ABradley", 2, 0, 6, "", [], false, "ABradley284", false, false);
// CreateUser("ASterczala", 3, 1, 11, "", [], false, "ASterczala371", false, false);
// CreateUser("ACalderone", 2, 0, 6, "", [], false, "ACalderone493", false, false);
// Demo Users
// CreateUser("DemoBeta", 3, 1, 11, "", [], false, "DemoBeta", false, false);


// CreateUser("DemoUser", 3, 1, 11, thisDate, [], true, "DemoUser", true, true);
// Adam Bradley, age 22, 6'0", 195 lbs. 2 years lifting experience, RPE experience (level 6 start), known maxes: squat 335, bench press 215, deadlift 365
// Adam Sterczala, age 33, 5'10" 220 lbs, 13 years lifting experience, RPE experience (level 11 start), known maxes: squat 640, bench press 440, deadlift 605
// Adam Calderone, age 26, 6'1", 190 lbs, 5 years lifting experience, RPE experience (level 6 start), known maxes: squat 320, bench press 235, deadlift 440

// CreateUser(3, 1, 11, thisDate);
// CreateUser(3, 2, 11, thisDate);
// CreateUser(4, 1, 16, thisDate);
// CreateUser(4, 2, 16, thisDate);

async function SetUser(id, levelGroup, blockNum, level, startDate, workoutDays) {
    console.log("id: ", id);
    return _index.User.findById(id).then(function (user) {
        var oldStat = {
            addLater: "Finish date, alloy pass/fail, level",
            finishDate: "",
            level: user.level
        };
        oldStat.statDict = user.stats;
        // currStats.addLater = "Finish date, alloy pass/fail, level";
        // currStats.finishDate = "";
        // currStats.level = user.level;
        user.oldstats.push(oldStat);
        user.changed('oldstats', true);
        user.save().then(function () {
            console.log("user.id", user.id);
            console.log("user.oldstats: ", user.oldstats);
            //CreateUser(id, levelGroup, blockNum, level, startDate, workoutDays) 
        });
    });
}

async function CreateUser(username, levelGroup, blockNum, level, startDate, workoutDays) {
    var admin = arguments.length > 6 && arguments[6] !== undefined ? arguments[6] : false;
    var password = arguments.length > 7 && arguments[7] !== undefined ? arguments[7] : "";
    var filledStats = arguments.length > 8 && arguments[8] !== undefined ? arguments[8] : true;
    var defaultWorkouts = arguments.length > 9 && arguments[9] !== undefined ? arguments[9] : true;
    var name = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : "";
    var active = arguments.length > 11 && arguments[11] !== undefined ? arguments[11] : false;

    console.log("CreateUser function. Name: ", name);
    var thisGroup = AllWorkouts[levelGroup];
    if (blockNum != 0) {
        thisGroup = thisGroup[blockNum];
    }
    var NWorkouts = Object.keys(thisGroup.getWeekDay).length;

    var _ref = await _index.User.findOrCreate({
        where: {
            username: username
        }
    }),
        _ref2 = _slicedToArray(_ref, 2),
        user = _ref2[0],
        created = _ref2[1];

    if (filledStats) {
        user.stats = StatTemplate;
    } else {
        user.stats = blankStatTemplate;
    }
    user.workouts = {};
    user.levelGroup = levelGroup;
    user.level = level;
    user.blockNum = blockNum;
    user.oldstats = [];
    user.oldworkouts = [];
    user.salt = generateSalt();
    if (name != "") {
        user.name = name;
    }
    var unHashed = "";
    if (!user.username || user.username == "") {
        user.username = "UserName" + user.id;
    }
    if (password == "") {
        unHashed = user.username;
    } else {
        unHashed = password;
    }
    // var unHashed = user.username;
    user.password = _index.User.generateHash(unHashed, user.salt);
    user.isAdmin = admin;
    await user.save();

    if (!defaultWorkouts) {
        //No default workouts
        console.log("created user: ", user.username, " hasdefaultWorkouts: ", defaultWorkouts, user.name);
        return;
    }
    // <- DO LATER
    // var inputs = {}; 
    var daysList = [];
    daysList.push(workoutDays[0]);
    daysList.push(workoutDays[1]);
    daysList.push(workoutDays[2]);
    // inputs["Day-1"] = workoutDays[0];
    // inputs["Day-2"] = workoutDays[1];
    // inputs["Day-3"] = workoutDays[2];
    if (workoutDays.length == 4) {
        // inputs["Day-4"] = workoutDays[3];
        daysList.push(workoutDays[3]);
    }
    // inputs.formattedDate = startDate;
    // inputs.workoutLevel = user.level;
    // inputs.workoutBlock = user.blockNum;
    await (0, _generateWorkouts.generateWorkouts)(user, startDate, daysList, false, !filledStats); //4th bool parameter if date is string (YYYY-MM-DD) GENERATE WORKOUTS RESETS STATS!!! (5th bool parameter)
    // assignWorkouts (user, inputs, true);
    await user.save();
    console.log("created user: ", user.username, " hasdefaultWorkouts: ", defaultWorkouts, user.name);
    return;
}

// module.exports = {
//     CreateUser,
//     SetUser,
// }

var Patterns = [];