var RPETable = require('./RPETable');
var Exercises = require('./Exercises');
var Workouts1 = require('./Workouts1-5');
var Workouts2 = require('./Workouts6-10');

var ExerciseDict = Exercises.ExerciseDict;

var AllWorkouts = {};
AllWorkouts[1] = Workouts1;
AllWorkouts[2] = Workouts2;


module.exports = {
    AllWorkouts,
    Workouts1,
    Workouts2,
    ExerciseDict,
    RPETable,
}
