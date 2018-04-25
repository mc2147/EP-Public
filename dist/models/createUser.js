'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _index = require('./index');

var _workoutFunctions = require('../api/apiFunctions/workoutFunctions');

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
CreateUser("UserName1", 1, 0, 1, thisDate, [1, 3, 5]);
CreateUser("UserName2", 2, 0, 6, thisDate, [1, 2, 3, 5]);
CreateUser("UserName3", 3, 1, 11, thisDate, [1, 2, 3, 5]);
CreateUser("UserName4", 4, 1, 16, thisDate, [1, 2, 3, 5]);
CreateUser("UserName5", 3, 2, 12, thisDate, [1, 2, 3, 5]);
CreateUser("UserName6", 4, 2, 16, thisDate, [1, 2, 3, 5]);
CreateUser("AdminBryce", 3, 1, 11, thisDate, [1, 2, 3, 5], true, "ABryce274");
CreateUser("AdminSterner", 3, 1, 11, thisDate, [1, 2, 3, 5], true, "ASterner368");

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

    user.stats = StatTemplate;
    user.workouts = {};
    user.levelGroup = levelGroup;
    user.level = level;
    user.blockNum = blockNum;
    user.oldstats = [];
    user.salt = generateSalt();
    if (!user.username || user.username == "") {
        user.username = "UserName" + user.id;
    }
    if (!user.password || user.password == "") {
        // user.password = "Password" + user.id; 
    }
    if (admin) {
        var unHashed = password;
        user.password = _index.User.generateHash(unHashed, user.salt);
        user.isAdmin = true;
        await user.save();
        return;
    }
    // var unHashed = "Password" + user.id;
    var unHashed = user.username;
    user.password = _index.User.generateHash(unHashed, user.salt);
    await user.save();
    // <- DO LATER
    var inputs = {};
    inputs["Day-1"] = workoutDays[0];
    inputs["Day-2"] = workoutDays[1];
    inputs["Day-3"] = workoutDays[2];
    if (workoutDays.length == 4) {
        inputs["Day-4"] = workoutDays[3];
    }
    inputs.formattedDate = startDate;
    // inputs.startDate = startDate;
    inputs.workoutLevel = user.level;
    inputs.workoutBlock = user.blockNum;
    (0, _workoutFunctions.assignWorkouts)(user, inputs, true);
    await user.save();
    return;
}

module.exports = {
    CreateUser: CreateUser,
    SetUser: SetUser
};

var Patterns = [];

// if (!WorkouthasData) {};


// var templateResponse = await axios.get(templateAPIURL
//     ,{ proxy: { host: '127.0.0.1', port: 3000 }}
// );
// var thisTemplate  = templateResponse.data;

// var subsAPIURL = templateAPIURL + '/subworkouts';
// var subData = await axios.get(subsAPIURL
//     ,{ proxy: { host: '127.0.0.1', port: 3000 }}
// );
// var thisSubs = subData.data;						
// // console.log("thisSubs", thisSubs);	
// thisSubs.forEach(elem => {
//     var _Type = elem.exerciseType;
//     if (_Type == "Med Ball") {_Type = "Medicine Ball";}
//     else if (_Type == "Vert Pull") {_Type = "UB Vert Pull";} 	
//     var eName = ExerciseDict[_Type][req.session.User.level].name;
//     var userPattern = elem.patternFormat;

//     userPattern.name = eName;
//     req.session.User.workouts[TemplateID].Patterns.push(userPattern);
//     req.session.User.save();
// });