const Sequelize = require('sequelize');
var models = require('./index');
var WorkoutTemplate = models.WorkoutTemplate;
var SubWorkoutTemplate = models.SubWorkoutTemplate;
var User = models.User;

var globalFuncs = require('../globals/functions');
var globalEnums = require('../globals/enums');

var getWorkoutDays = globalFuncs.getWorkoutDays;

var data = require('../data');
    var Workouts1 = data.Workouts1;
    var Workouts2 = data.Workouts2;
    var AllWorkouts = data.AllWorkouts;

// var thisGroup = Workouts1;

// console.log("assigning workouts:");
var DayValue = 24*3600*1000;

var Alloy = globalEnums.Alloy;

var StatTemplate = {
    "UB Hor Push": {Status: Alloy.None, Max: 200, LastSet: "", Name: ""}, 
    "UB Vert Push": {Status: Alloy.None, Max: 200, LastSet: "", Name: ""}, 
    "UB Hor Pull": {Status: Alloy.None, Max: 200, LastSet: "", Name: ""}, 
    "UB Vert Pull": {Status: Alloy.None, Max: 200, LastSet: "", Name: ""}, 
    "Hinge": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""},
    "Squat": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
    "LB Uni Push": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
    "Ant Chain": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
    "Post Chain": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
    "Carry": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
    "Iso 1": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
    "Iso 2": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
    "Iso 3": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
    "Iso 4": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
    "RFD Load": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
    "RFD Unload 1": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
    "RFD Unload 2": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
    "Medicine Ball": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""},     
    "Level Up": {
        Status: Alloy.None, 
        Squat: Alloy.None,
        UBHorPush: Alloy.None,
        Hinge: Alloy.None,
    },
};
var WorkoutInstanceTemplate = {
    ID: null,
    Week: null,
    Day: null,
    Date: null,
    Completed: false,
    Patterns: [],
}


var oldDate = new Date(Date.now() - 10*DayValue);
var thisDate = new Date(Date.now());         

// CreateUser(1, 1, oldDate);
// CreateUser(1, 0, 1, thisDate);

// CreateUser(2, 0, 6, thisDate);
// CreateUser(3, 1, 11, thisDate);
// CreateUser(3, 2, 11, thisDate);
// CreateUser(4, 1, 16, thisDate);
CreateUser(4, 2, 16, thisDate);

function CreateUser(levelGroup, blockNum, level, startDate) {
    var thisGroup = AllWorkouts[levelGroup];
    if (blockNum != 0) {
        thisGroup = thisGroup[blockNum];
    }
    // console.log("thisGroup", thisGroup);
    var NWorkouts = Object.keys(thisGroup.getWeekDay).length;
    return User.findOrCreate(
        {
         where: {
             id: 1,
         }
     }).spread((user, created) => {
         if (created) {}
         user.stats = StatTemplate;
         user.workouts = {};        
         user.levelGroup = levelGroup;
         user.blockNum = blockNum;
         user.save();
        //  console.log("setting LevelGroup: " + user.levelGroup);
        //  console.log("Counting Workouts: " + Object.keys(thisGroup.getWeekDay).length)
         user.level = level; 
         //  Instance variables
         var workoutDates = getWorkoutDays(startDate, [1, 3, 5], 1, "", NWorkouts);
        //  console.log("96");
        //  console.log(workoutDates, workoutDates.length);
         user.workoutDates = workoutDates;
         user.currentWorkoutID = 1;
         // Sort workouts by LGroups and blocks -> ID
         for (var W in thisGroup.Templates) {
             var thisWeek = thisGroup.Templates[W];
             for (var D in thisWeek) {
                 var ID = thisWeek[D].ID;
                 user.workouts[ID] = Object.assign({}, WorkoutInstanceTemplate);                 
                 user.workouts[ID].Week = W;
                 user.workouts[ID].Day = D;
                 user.workouts[ID].ID = ID;
                 user.workouts[ID].Date = workoutDates[ID - 1];
                 if (user.workouts[ID].Date >= thisDate && !user.currentWorkoutID) {
                    user.currentWorkoutID = ID;
                 }
                 user.save();
             }
         }
        //  user.workouts[13] = WorkoutInstanceTemplate;
        // Workout Completion Code
        //  missedWorkouts(user, new Date(2018, 02, 15, 00, 0, 0, 0), new Date(2018, 02, 22, 00, 0, 0, 0));
         user.save();
     })
     .then(() => {
         console.log("User PROMISE RESOLVED");
     })
}

module.exports = {
    CreateUser,
}