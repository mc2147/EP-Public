const Sequelize = require('sequelize');
var data = require('../data');
var models = require('./index');
var WorkoutTemplate = models.WorkoutTemplate;
var SubWorkoutTemplate = models.SubWorkoutTemplate;
var User = models.User;

var globalFuncs = require('../globals/functions');
var globalEnums = require('../globals/enums');

var getWorkoutDays = globalFuncs.getWorkoutDays;
var Workouts1 = data.Workouts1;


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


CreateUser();


function CreateUser() {
    User.findOrCreate(
        {
         where: {
             id: 1,
         }
     }).spread((user, created) => {
         if (created) {}
         user.currentWorkout = {
             ID: 1,
             Week: 1,
             Day: 1,
             Patterns: []
         };        
         user.stats = StatTemplate;
         user.workouts = {};

     //  Instance variables
         user.level = 1; 
         // console.log(new Date(Date.now() - 10*DayValue));
         var oldDate = new Date(Date.now() - 10*DayValue);
         var thisDate = new Date(Date.now());
     
         var workoutDates = getWorkoutDays(oldDate, [1, 3, 5], 1, "", 12);
         user.workoutDates = workoutDates;
         user.currentWorkoutID = null;
         // Sort workouts by LGroups and blocks -> ID
         for (var W in Workouts1.Templates) {
             var thisWeek = Workouts1.Templates[W];
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
         user.workouts[13] = WorkoutInstanceTemplate;
        // Workout Completion Code
        //  missedWorkouts(user, new Date(2018, 02, 15, 00, 0, 0, 0), new Date(2018, 02, 22, 00, 0, 0, 0));

         user.save();
     })
}

