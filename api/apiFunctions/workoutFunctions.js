import { getWorkoutDays } from "../../globals/functions";
import { AllWorkouts, ExerciseDict } from "../../data";
import { DaysofWeekDict } from "../../globals/enums";
import { User, Video, WorkoutTemplate } from "../../models";
import axios from "axios";
import bcrypt from "bcryptjs";
const saltRounds = 10;

function generateSalt() {
  return bcrypt.genSaltSync(saltRounds);
}
function generateHash(password, salt) {
  return bcrypt.hashSync(password, salt, null);
}

export async function signupUser(input) {
  var P1 = input.P1;
  var P2 = input.P2;
  var username = input.username;
  var salt = generateSalt();
  if (P1 == P2) {
    var hashedPassword = generateHash(P1, salt);
    var newUser = await User.create({
      username: username,
      salt: salt,
      password: hashedPassword
    });
    if (newUser) {
      return {
        newUser,
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

export async function assignLevel(_User, input) {
  let { squatWeight, benchWeight, RPEExp, bodyWeight } = input;
  if (squatWeight < bodyWeight) {
    _User.level = 1;
  } else if (
    squatWeight > bodyWeight * 1.5 &&
    benchWeight > bodyWeight &&
    RPEExp
  ) {
    _User.level = 11;
  } else {
    _User.level = 6;
  }
  await _User.save();
}

export async function rescheduleWorkouts(user, newStart, daysOfWeek, n = 0) {
  let Now = new Date(Date.now());
  let nIncomplete = 0;
  let nComplete = 0;
  let defaultShift = 0;

  let completedDates = [];
  let lastCompletedDate = false;
  for (var K in user.workouts) {
    let W = user.workouts[K];
    let wDate = new Date(W.Date);
    if (W.Completed) {
      nComplete++;
      completedDates.push(wDate);
      lastCompletedDate = wDate;
    } else {
      //If incomplete and less than now
      nIncomplete++;
      if (
        //Check if date is less than Now
        wDate &&
        wDate.getDate() < Now.getDate() &&
        wDate.getMonth() <= Now.getMonth()
      ) {
        defaultShift++;
      }
    }
  }
  if (lastCompletedDate != false) {
    if (
      newStart.getDate() == lastCompletedDate.getDate() &&
      newStart.getMonth() == lastCompletedDate.getMonth() &&
      newStart.getYear() == lastCompletedDate.getYear()
    ) {
      newStart.setDate(newStart.getDate() + 1);
    }
  }

  let newIncompleteDates = getWorkoutDays(
    newStart,
    daysOfWeek,
    0,
    "",
    nIncomplete
  );

  let newDates = completedDates.concat(newIncompleteDates);

  let dateIndex = 0;
  let newDateObj = {};

  for (var K in user.workouts) {
    let W = user.workouts[K];
    if (!W.Completed) {
      W.Date = newDates[dateIndex];
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

export async function getblankPatterns(lGroup, block, W, D, level) {
  var blankPatterns = [];
  var subsURL = `/api/workout-templates/${lGroup}/block/${block}/week/${W}/day/${D}/subworkouts`;
  var subsResponse = await axios.get(process.env.BASE_URL + subsURL);
  var subsList = subsResponse.data;

  subsList.sort(function(a, b) {
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

    let effectiveLevel = level;
    let deloadIndicator = "";
    if (patternInstance.deload && patternInstance.deload != 0) {
      if (level + patternInstance.deload > 0) {
        effectiveLevel = level + patternInstance.deload;
      }
    }
    let EObj = ExerciseDict.Exercises[patternInstance.type][effectiveLevel];
    var EName = EObj.name;
    if (EName.includes("Tempo") || EName.includes("tempo")) {
      patternInstance.hasTempo = true;
    }

    if (EObj.bodyweight) {
      patternInstance.workoutType = "bodyweight";
    }
    patternInstance.name = EName + deloadIndicator;

    var findVideo = await Video.search(EName, false);
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
      patternInstance.selectedVideo.levels = LevelList.slice(
        findVideo.LevelAccess - 1
      );
    }

    blankPatterns.push(patternInstance);
  }

  return blankPatterns;
}
