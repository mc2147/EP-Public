"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.signupUser = signupUser;
exports.assignLevel = assignLevel;
exports.rescheduleWorkouts = rescheduleWorkouts;
exports.getblankPatterns = getblankPatterns;

var _functions = require("../../globals/functions");

var _data = require("../../data");

var _enums = require("../../globals/enums");

var _models = require("../../models");

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _bcryptjs = require("bcryptjs");

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var saltRounds = 10;

function generateSalt() {
  return _bcryptjs2.default.genSaltSync(saltRounds);
}
function generateHash(password, salt) {
  return _bcryptjs2.default.hashSync(password, salt, null);
}

async function signupUser(input) {
  var P1 = input.P1;
  var P2 = input.P2;
  var username = input.username;
  var salt = generateSalt();
  if (P1 == P2) {
    var hashedPassword = generateHash(P1, salt);
    var newUser = await _models.User.create({
      username: username,
      salt: salt,
      password: hashedPassword
    });
    if (newUser) {
      return {
        newUser: newUser,
        session: {
          userId: newUser.id,
          username: username,
          User: newUser
        }
      };
    } else {
      return {
        error: true,
        status: "error"
      };
    }
  } else {
    return false;
  }
}

async function assignLevel(_User, input) {
  var squatWeight = input.squatWeight,
      benchWeight = input.benchWeight,
      RPEExp = input.RPEExp,
      bodyWeight = input.bodyWeight;

  if (squatWeight < bodyWeight) {
    _User.level = 1;
  } else if (squatWeight > bodyWeight * 1.5 && benchWeight > bodyWeight && RPEExp) {
    _User.level = 11;
  } else {
    _User.level = 6;
  }
  await _User.save();
}

async function rescheduleWorkouts(user, newStart, daysOfWeek) {
  var n = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 0;

  var Now = new Date(Date.now());
  var nIncomplete = 0;
  var nComplete = 0;
  var defaultShift = 0;

  var completedDates = [];
  var lastCompletedDate = false;
  for (var K in user.workouts) {
    var W = user.workouts[K];
    var wDate = new Date(W.Date);
    if (W.Completed) {
      nComplete++;
      completedDates.push(wDate);
      lastCompletedDate = wDate;
    } else {
      //If incomplete and less than now
      nIncomplete++;
      if (
      //Check if date is less than Now
      wDate && wDate.getDate() < Now.getDate() && wDate.getMonth() <= Now.getMonth()) {
        defaultShift++;
      }
    }
  }
  if (lastCompletedDate != false) {
    if (newStart.getDate() == lastCompletedDate.getDate() && newStart.getMonth() == lastCompletedDate.getMonth() && newStart.getYear() == lastCompletedDate.getYear()) {
      newStart.setDate(newStart.getDate() + 1);
    }
  }

  var newIncompleteDates = (0, _functions.getWorkoutDays)(newStart, daysOfWeek, 0, "", nIncomplete);

  var newDates = completedDates.concat(newIncompleteDates);

  var dateIndex = 0;
  var newDateObj = {};

  for (var K in user.workouts) {
    var _W = user.workouts[K];
    if (!_W.Completed) {
      _W.Date = newDates[dateIndex];
      user.workouts[K].date = newDates[dateIndex];
    }
    dateIndex++;
  }
  user.workoutDates = newDates;
  console.log("\n\n");
  await user.changed("workouts", true);
  await user.save();
  return newDates;
}

async function getblankPatterns(lGroup, block, W, D, level) {
  var blankPatterns = [];
  var subsURL = "/api/workout-templates/" + lGroup + "/block/" + block + "/week/" + W + "/day/" + D + "/subworkouts";
  var subsResponse = await _axios2.default.get(process.env.BASE_URL + subsURL);
  var subsList = subsResponse.data;

  subsList.sort(function (a, b) {
    return a.number - b.number;
  });

  for (var i = 0; i < subsList.length; i++) {
    var sub = subsList[i];
    var patternInstance = sub.patternFormat;

    var EType = sub.exerciseType;
    if (EType == "Med Ball") {
      EType = "Medicine Ball";
    } else if (EType == "Vert Pull") {
      EType = "UB Vert Pull";
    }
    patternInstance.type = EType;

    var effectiveLevel = level;
    var deloadIndicator = "";
    if (patternInstance.deload && patternInstance.deload != 0) {
      if (level + patternInstance.deload > 0) {
        effectiveLevel = level + patternInstance.deload;
      }
    }
    var EObj = _data.ExerciseDict.Exercises[patternInstance.type][effectiveLevel];
    var EName = EObj.name;
    if (EName.includes("Tempo") || EName.includes("tempo")) {
      patternInstance.hasTempo = true;
    }

    if (EObj.bodyweight) {
      patternInstance.workoutType = "bodyweight";
    }
    patternInstance.name = EName + deloadIndicator;

    var findVideo = await _models.Video.search(EName, false);
    if (findVideo) {
      patternInstance.hasVideo = true;
      patternInstance.videoURL = findVideo.url;
      patternInstance.selectedVideo = {
        URL: findVideo.url,
        label: findVideo.title,
        image: "../../static/video_placeholder.png",
        description: findVideo.description,
        LevelAccess: findVideo.levelAccess
      };

      var LevelList = [];
      for (var x = 1; x <= 25; x++) {
        LevelList.push(x);
      }
      patternInstance.selectedVideo.levels = LevelList.slice(findVideo.LevelAccess - 1);
    }

    blankPatterns.push(patternInstance);
  }

  return blankPatterns;
}