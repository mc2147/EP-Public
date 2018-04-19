'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.signupUser = signupUser;
exports.assignWorkouts = assignWorkouts;

var _functions = require('../globals/functions');

var _data = require('../data');

var _enums = require('../globals/enums');

var _models = require('../models');

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _bcryptjs = require('bcryptjs');

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var saltRounds = 10;

function generateSalt() {
    return _bcryptjs2.default.genSaltSync(saltRounds);
}

async function signupUser(input) {
    var P1 = input.P1;
    var P2 = input.P2;
    var username = input.username;
    var salt = generateSalt();
    if (P1 == P2) {
        var hashedPassword = generateHash(P1, salt);
        _models.User.create({
            id: 29,
            username: username,
            salt: salt,
            password: hashedPassword
        }).then(function (user) {
            return {
                user: user,
                session: {
                    userId: user.id,
                    username: username,
                    User: user
                }
            };
        }).catch(function (err) {
            return {
                error: true,
                status: "error"
            };
        });
    } else {
        return false;
    }
}

//Assigns a set of workouts to the user depending on level, start date, and workout days (list) 
async function assignWorkouts(_User, input) {
    var newUser = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

    // console.log("creating workouts from: ", input);
    var dateSplit = input.startDate.split("-");
    var dateNow = Date.now();
    input.dateObj2 = new Date(parseInt(dateSplit[0]), parseInt(dateSplit[1] - 1), parseInt(dateSplit[2] - 1));
    var daysList = [parseInt(input["Day-1"]), parseInt(input["Day-2"]), parseInt(input["Day-3"])];
    var Level = parseInt(input.workoutLevel); //Determine N Workouts based on that
    var Group = 0;
    var Block = parseInt(input.workoutBlock);
    var TemplatesJSON = {};
    input.level = Level;
    if (Level <= 5) {
        Group = 1;
        TemplatesJSON = _data.AllWorkouts[Group];
    } else if (Level <= 10) {
        Group = 2;
        TemplatesJSON = _data.AllWorkouts[Group];
        daysList.push(parseInt(input["Day-4"]));
    } else if (Level <= 16) {
        Group = 3;
        // Block = "a";
        TemplatesJSON = _data.AllWorkouts[Group][Block];
        daysList.push(parseInt(input["Day-4"]));
    } else {
        Group = 4;
        // Block = "a";
        TemplatesJSON = _data.AllWorkouts[Group][Block];
        daysList.push(parseInt(input["Day-4"]));
    }
    var nWorkouts = Object.keys(TemplatesJSON.getWeekDay).length;
    input.nWorkouts = nWorkouts;
    input.daysList = daysList;

    var workoutDates = (0, _functions.getWorkoutDays)(input.dateObj2, daysList, Level, "", nWorkouts);
    input.workoutDates = workoutDates;
    input.detailedworkoutDates = [];
    workoutDates.forEach(function (elem) {
        var item = [elem];
        item.push(_enums.DaysofWeekDict[elem.getDay()]);
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
                Patterns: []
            };
            input.workouts[ID].Week = W;
            input.workouts[ID].Day = D;
            input.workouts[ID].ID = ID;
            var thisworkoutDate = workoutDates[ID - 1];
            input.workouts[ID].Date = thisworkoutDate;
            var describerPrefix = "Level " + Level;
            var blockString = "";
            if (_User.blockNum != 0) {
                if (_User.blockNum == 1) {
                    blockString = ", Block 1: Volume";
                } else if (_User.blockNum == 2) {
                    blockString = ", Block 2: Strength/Power";
                }
            }
            var Describer = describerPrefix + blockString + " - " + " Week " + W + ", Day " + D;
            input.workouts[ID].Describer = Describer;
            var subsURL = '/api/workout-templates/' + _User.levelGroup + '/block/' + _User.blockNum + '/week/' + W + '/day/' + D + '/subworkouts';
            var subsResponse = await _axios2.default.get(subsURL, { proxy: { host: 'localhost', port: 3000 } });
            var subsList = subsResponse.data;
            console.log("subList for: ", W, D, subsList.length);
            // input.workouts[ID].Patterns = subsList;
            // console.log("line 80 subsList",subsList);
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
                console.log("97");
                var findVideo = await _models.Video.search(EName, false);
                console.log("99");
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
                    for (var i = 1; i <= 25; i++) {
                        LevelList.push(i);
                    }
                    patternInstance.selectedVideo.levels = LevelList.slice(findVideo.LevelAccess - 1);
                }
                input.workouts[ID].Patterns.push(patternInstance);
                console.log("Pushing sub for Pattern: ", ID);
            }
            console.log(ID, "Patterns: ", input.workouts[ID].Patterns.length);
        }
    }
    _User.workouts = input.workouts;
    _User.currentWorkoutID = 1;
    _User.workoutDates = workoutDates;
    _User.resetStats = true;
}