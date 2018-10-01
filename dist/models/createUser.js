"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.SetUser = SetUser;
exports.CreateUser = CreateUser;

var _index = require("./index");

var _generateWorkouts = require("../api/apiFunctions/generateWorkouts");

var axios = require("axios");
var Sequelize = require("sequelize");


var globalFuncs = require("../globals/functions");
var globalEnums = require("../globals/enums");

var getWorkoutDays = globalFuncs.getWorkoutDays;

var data = require("../data");
var Workouts1 = data.Workouts1;
var Workouts2 = data.Workouts2;
var AllWorkouts = data.AllWorkouts;
var ExerciseDict = data.ExerciseDict.Exercises;

var bcrypt = require("bcryptjs");

var saltRounds = 10;
function generateSalt() {
  return bcrypt.genSaltSync(saltRounds);
}

function generateHash(password, salt) {
  return bcrypt.hashSync(password, salt, null);
}

var DayValue = 24 * 3600 * 1000;

var Alloy = globalEnums.Alloy;

var StatTemplate = {
  "UB Hor Push": { Status: Alloy.None, Max: 200, LastSet: "", Name: "" },
  "UB Vert Push": { Status: Alloy.None, Max: 200, LastSet: "", Name: "" },
  "UB Hor Pull": { Status: Alloy.None, Max: 200, LastSet: "", Name: "" },
  "UB Vert Pull": { Status: Alloy.None, Max: 200, LastSet: "", Name: "" },
  Hinge: { Status: Alloy.None, Max: 100, LastSet: "", Name: "" },
  Squat: { Status: Alloy.None, Max: 100, LastSet: "", Name: "" },
  "LB Uni Push": { Status: Alloy.None, Max: 100, LastSet: "", Name: "" },
  "Ant Chain": { Status: Alloy.None, Max: 100, LastSet: "", Name: "" },
  "Post Chain": { Status: Alloy.None, Max: 100, LastSet: "", Name: "" },
  Carry: { Status: Alloy.None, Max: 100, LastSet: "", Name: "" },
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
  Hinge: { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
  Squat: { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
  "LB Uni Push": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
  "Ant Chain": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
  "Post Chain": { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
  Carry: { Status: Alloy.None, Max: null, LastSet: "", Name: "" },
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

async function SetUser(id, levelGroup, blockNum, level, startDate, workoutDays) {
  return _index.User.findById(id).then(function (user) {
    var oldStat = {
      addLater: "Finish date, alloy pass/fail, level",
      finishDate: "",
      level: user.level
    };
    oldStat.statDict = user.stats;

    user.oldstats.push(oldStat);
    user.changed("oldstats", true);
    user.save().then(function (user) {
      return user;
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

  user.password = _index.User.generateHash(unHashed, user.salt);
  user.isAdmin = admin;
  await user.save();

  if (!defaultWorkouts) {
    //No default workouts
    console.log("created user: ", user.username, " hasdefaultWorkouts: ", defaultWorkouts, user.name);
    return;
  }

  var daysList = [];
  daysList.push(workoutDays[0]);
  daysList.push(workoutDays[1]);
  daysList.push(workoutDays[2]);

  if (workoutDays.length == 4) {
    daysList.push(workoutDays[3]);
  }

  await (0, _generateWorkouts.generateWorkouts)(user, startDate, daysList, false, !filledStats);
  await user.save();

  return;
}

var Patterns = [];