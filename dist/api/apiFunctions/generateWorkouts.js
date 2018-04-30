'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.generateWorkouts = generateWorkouts;

var _functions = require('../../globals/functions');

var _data = require('../../data');

var _enums = require('../../globals/enums');

var _models = require('../../models');

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function generateWorkouts(user, startDate, dayList) {
    var stringDate = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    var output = {
        workoutDates: [],
        detailedworkoutDates: [],
        workouts: {}
    };
    var dateObj = startDate;
    if (stringDate) {
        var dateSplit = startDate.split("-");
        dateObj = new Date(parseInt(dateSplit[0]), parseInt(dateSplit[1]) - 1, parseInt(dateSplit[2]) - 1);
    }
    var workoutDays = [parseInt(dayList[0]), parseInt(dayList[1]), parseInt(dayList[2])];

    var Level = user.level; //Determine N Workouts based on this
    var Group = user.levelGroup;
    var Block = user.blockNum;

    var TemplatesJSON = {};

    if (Level <= 5) {
        Group = 1;
        TemplatesJSON = _data.AllWorkouts[Group];
    } else if (Level <= 10) {
        Group = 2;
        TemplatesJSON = _data.AllWorkouts[Group];
        workoutDays.push(parseInt(dayList[3]));
    } else if (Level <= 16) {
        Group = 3;
        TemplatesJSON = _data.AllWorkouts[Group][Block];
        workoutDays.push(parseInt(dayList[3]));
    } else {
        Group = 4;
        TemplatesJSON = _data.AllWorkouts[Group][Block];
        workoutDays.push(parseInt(dayList[3]));
    }

    var nWorkouts = Object.keys(TemplatesJSON.getWeekDay).length;
    console.log("dateObj: ", dateObj);
    var workoutDates = (0, _functions.getWorkoutDays)(dateObj, workoutDays, Level, "", nWorkouts);
    workoutDates.forEach(function (elem) {
        var describer = [elem];
        describer.push(_enums.DaysofWeekDict[elem.getDay()]);
        output.detailedworkoutDates.push(describer);
    });

    user.workoutDates = workoutDates;
    output.workoutDates = workoutDates;

    var Templates = TemplatesJSON.Templates;
    for (var W in Templates) {
        var thisWeek = Templates[W];
        for (var D in thisWeek) {
            var ID = thisWeek[D].ID;
            output.workouts[ID] = {
                ID: null,
                Week: null,
                Day: null,
                Date: null,
                Completed: false,
                Patterns: []
            };
            output.workouts[ID].Week = W;
            output.workouts[ID].Day = D;
            output.workouts[ID].ID = ID;
            var thisworkoutDate = workoutDates[ID - 1];
            output.workouts[ID].Date = thisworkoutDate;
            var describerPrefix = "Level " + Level;
            var blockString = "";
            if (user.blockNum != 0) {
                if (user.blockNum == 1) {
                    blockString = ", Block 1: Volume";
                } else if (user.blockNum == 2) {
                    blockString = ", Block 2: Strength/Power";
                }
            }
            var Describer = describerPrefix + blockString + " - " + " Week " + W + ", Day " + D;
            output.workouts[ID].Describer = Describer;
            console.log("Group, Block, W, D", user.levelGroup, user.blockNum, W, D);
            var relatedTemplate = await _models.WorkoutTemplate.findOne({
                where: {
                    levelGroup: user.levelGroup,
                    block: user.blockNum,
                    week: W,
                    day: D
                }
            });
            var subsList = await relatedTemplate.getSubWorkouts();

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
                var EName = _data.ExerciseDict.Exercises[patternInstance.type][Level].name;
                patternInstance.name = EName;
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

                    var LevelList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25];
                    console.log("   LevelAccess: " + findVideo.LevelAccess);
                    var levelFilter = findVideo.LevelAccess ? findVideo.LevelAccess : 1;
                    // patternInstance.selectedVideo.levels = LevelList.slice(levelFilter - 1);
                }
                output.workouts[ID].Patterns.push(patternInstance);
            }
        }
    }
    user.workouts = output.workouts;
    user.currentWorkoutID = 1;
    user.resetStats = true;
    user.save();
    return output;
}