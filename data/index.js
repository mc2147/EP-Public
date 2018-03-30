var RPETable = require('./RPETable');
var Exercises = require('./Exercises');
var Workouts1 = require('./Workouts1-5');
var Workouts2 = require('./Workouts6-10');
var Workouts3a = require('./Workouts3a');
var Workouts3b = require('./Workouts3b');
var Workouts4a = require('./Workouts4a');
var Workouts4b = require('./Workouts4b');

var ExerciseDict = Exercises.ExerciseDict;

var AllWorkouts = {};
AllWorkouts[1] = Workouts1;
AllWorkouts[2] = Workouts2;
AllWorkouts[3] = {}
AllWorkouts[3]["a"] = Workouts3a;
AllWorkouts[3]["b"] = Workouts3b;
AllWorkouts[4] = {}
AllWorkouts[4]["a"] = Workouts4a;
AllWorkouts[4]["b"] = Workouts4b;


module.exports = {
    AllWorkouts,
    Workouts1,
    Workouts2,
    ExerciseDict,
    RPETable,
}
