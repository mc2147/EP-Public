const axios = require("axios");
const Sequelize = require("sequelize");
import { WorkoutTemplate, SubWorkoutTemplate, User, Video } from "./index";

import { generateWorkouts } from "../api/apiFunctions/generateWorkouts";

var globalFuncs = require("../globals/functions");
var globalEnums = require("../globals/enums");

var getWorkoutDays = globalFuncs.getWorkoutDays;

var data = require("../data");
var Workouts1 = data.Workouts1;
var Workouts2 = data.Workouts2;
var AllWorkouts = data.AllWorkouts;
var ExerciseDict = data.ExerciseDict.Exercises;

const bcrypt = require("bcryptjs");

const saltRounds = 10;
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

export async function SetUser(
  id,
  levelGroup,
  blockNum,
  level,
  startDate,
  workoutDays
) {
  return User.findById(id).then(user => {
    var oldStat = {
      addLater: "Finish date, alloy pass/fail, level",
      finishDate: "",
      level: user.level
    };
    oldStat.statDict = user.stats;

    user.oldstats.push(oldStat);
    user.changed("oldstats", true);
    user.save().then(user => {
      return user;
    });
  });
}

export async function CreateUser(
  username,
  levelGroup,
  blockNum,
  level,
  startDate,
  workoutDays,
  admin = false,
  password = "",
  filledStats = true,
  defaultWorkouts = true,
  name = "",
  active = false
) {
  var thisGroup = AllWorkouts[levelGroup];
  if (blockNum != 0) {
    thisGroup = thisGroup[blockNum];
  }
  var NWorkouts = Object.keys(thisGroup.getWeekDay).length;
  var [user, created] = await User.findOrCreate({
    where: {
      username: username
    }
  });
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
  let unHashed = "";
  if (!user.username || user.username == "") {
    user.username = "UserName" + user.id;
  }
  if (password == "") {
    unHashed = user.username;
  } else {
    unHashed = password;
  }

  user.password = User.generateHash(unHashed, user.salt);
  user.isAdmin = admin;
  await user.save();

  if (!defaultWorkouts) {
    //No default workouts
    console.log(
      "created user: ",
      user.username,
      " hasdefaultWorkouts: ",
      defaultWorkouts,
      user.name
    );
    return;
  }

  let daysList = [];
  daysList.push(workoutDays[0]);
  daysList.push(workoutDays[1]);
  daysList.push(workoutDays[2]);

  if (workoutDays.length == 4) {
    daysList.push(workoutDays[3]);
  }

  await generateWorkouts(user, startDate, daysList, false, !filledStats);
  await user.save();

  return;
}

var Patterns = [];
