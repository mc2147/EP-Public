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

const bcrypt = require('bcryptjs');

const saltRounds = 10;
function generateSalt(){
    return bcrypt.genSaltSync(saltRounds);
}

function generateHash (password, salt){
    return bcrypt.hashSync(password, salt, null);
}

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
//CreateUser:
    //id, levelGroup, blockNum, level, startDate, workoutDays
//Level Groups 1 to 4, block 1
// "UserName2"
CreateUser("UserName1", 1, 0, 1, thisDate, [1, 3, 5]);
CreateUser("UserName2", 2, 0, 6, thisDate, [1, 2, 3, 5]);
CreateUser("UserName3", 3, 1, 11, thisDate, [1, 2, 3, 5]);
CreateUser("UserName4", 4, 1, 11, thisDate, [1, 2, 3, 5]);

CreateUser("UserName5", 3, 2, 11, thisDate, [1, 2, 3, 5]);
CreateUser("UserName6", 4, 2, 11, thisDate, [1, 2, 3, 5]);

// CreateUser(3, 1, 11, thisDate);
// CreateUser(3, 2, 11, thisDate);
// CreateUser(4, 1, 16, thisDate);
// CreateUser(4, 2, 16, thisDate);

async function SetUser(id, levelGroup, blockNum, level, startDate, workoutDays) {
    console.log("id: ", id);
    return User.findById(id).then((user) => {
        var oldStat = {
            addLater : "Finish date, alloy pass/fail, level",
            finishDate : "",
            level : user.level,
        };
        oldStat.statDict = user.stats
        // currStats.addLater = "Finish date, alloy pass/fail, level";
        // currStats.finishDate = "";
        // currStats.level = user.level;
        user.oldstats.push(oldStat);
        user.changed( 'oldstats', true);
        user.save().then(() => {
            console.log("user.id", user.id);
            console.log("user.oldstats: ", user.oldstats);
            //CreateUser(id, levelGroup, blockNum, level, startDate, workoutDays) 
        })
    }) 
}

function CreateUser(username, levelGroup, blockNum, level, startDate, workoutDays) {
    var thisGroup = AllWorkouts[levelGroup];
    if (blockNum != 0) {
        thisGroup = thisGroup[blockNum];
    }
    // console.log("thisGroup", thisGroup);
    var NWorkouts = Object.keys(thisGroup.getWeekDay).length;
    // console.log("thisGroup: ", thisGroup);
    // console.log("NWorkouts", NWorkouts);
    return User.findOrCreate(
        {
         where: {
            username: username,
         }
     }).spread((user, created) => {
         if (created) {}
         user.stats = StatTemplate;
         user.workouts = {};        
         user.levelGroup = levelGroup;
         user.level = level; 
         user.blockNum = blockNum;
         user.oldstats = [];
         user.salt = generateSalt();
         if (!user.username || user.username == "") {
            user.username = "UserName" + user.id; 
         }
         if (!user.password || user.password == "") {
             // user.password = "Password" + user.id; 
            }
        var unHashed = "Password" + user.id;
        user.password = User.generateHash(unHashed, user.salt);
        //  user.oldstats.push({"test create user": "testing"});
        //  user.changed( 'oldstats', true);
         user.save();
        //  console.log("setting LevelGroup: " + user.levelGroup);
        //  console.log("Counting Workouts: " + Object.keys(thisGroup.getWeekDay).length)
         //  Instance variables
         var workoutDates = getWorkoutDays(startDate, workoutDays, 1, "", NWorkouts);
        //  console.log("96");
        //  console.log(workoutDates, workoutDates.length);
         user.workoutDates = workoutDates;
         user.currentWorkoutID = 1;
         // Sort workouts by LGroups and blocks -> ID
         for (var W in thisGroup.Templates) {
             var thisWeek = thisGroup.Templates[W];
             for (var D in thisWeek) {
                //  console.log("105", W, D, thisWeek[D]);
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
                //  console.log(user.workouts);
             }
         }
        //  user.workouts[13] = WorkoutInstanceTemplate;
        // Workout Completion Code
        //  missedWorkouts(user, new Date(2018, 02, 15, 00, 0, 0, 0), new Date(2018, 02, 22, 00, 0, 0, 0));
        user.save();
        // console.log("User.workouts: ", user.workouts);
		// console.log("# of workoutDates: ", user.workoutDates.length);
     })
     .then(() => {
        //  console.log("User PROMISE RESOLVED");
     })
}

module.exports = {
    CreateUser,
    SetUser,
}