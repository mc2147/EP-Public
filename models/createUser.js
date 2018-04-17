const axios = require('axios');
// import axios from 'axios';
const Sequelize = require('sequelize');
// var models = require('./index');
// var WorkoutTemplate = models.WorkoutTemplate;
// var SubWorkoutTemplate = models.SubWorkoutTemplate;
// var User = models.User;
import {WorkoutTemplate, SubWorkoutTemplate, User, Video} from './index';

var globalFuncs = require('../globals/functions');
var globalEnums = require('../globals/enums');

var getWorkoutDays = globalFuncs.getWorkoutDays;

var data = require('../data');
    var Workouts1 = data.Workouts1;
    var Workouts2 = data.Workouts2;
    var AllWorkouts = data.AllWorkouts;
	var ExerciseDict = data.ExerciseDict.Exercises;

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

// var relatedSubsResponse = axios.get("/api/users" ,{ proxy: { host: 'localhost', port: 3000 }});
// var test = axios.get('/api/users');
//     ,{ proxy: { host: '127.0.0.1', port: 3000 }}
// );

async function CreateUser(username, levelGroup, blockNum, level, startDate, workoutDays) {
    var thisGroup = AllWorkouts[levelGroup];
    if (blockNum != 0) {
        thisGroup = thisGroup[blockNum];
    }
    // console.log("thisGroup", thisGroup);
    var NWorkouts = Object.keys(thisGroup.getWeekDay).length;
    // console.log("thisGroup: ", thisGroup);
    // console.log("NWorkouts", NWorkouts);
    var [user, created] = await User.findOrCreate(
        {
         where: {
            username: username,
         }
     });
    //  return
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
    await user.save();
    //  Instance variables
    var workoutDates = getWorkoutDays(startDate, workoutDays, 1, "", NWorkouts);
    user.workoutDates = workoutDates;
    user.currentWorkoutID = 1;
    console.log("CU 158");
        // Sort workouts by LGroups and blocks -> ID
    for (var W in thisGroup.Templates) {
        var thisWeek = thisGroup.Templates[W];
        for (var D in thisWeek) {
            // console.log("105", W, D, thisWeek[D]);
            var relatedTemplate = await WorkoutTemplate.findOne({
                where: {
                    levelGroup:levelGroup,
                    block:blockNum,
                    week: W,
                    day: D,
                }
            });
            var subsURL = `/api/workout-templates/${levelGroup}/block/${blockNum}/week/${W}/day/${D}/subworkouts`;    
            var subs = await relatedTemplate.getSubWorkouts();
            subs.sort(function(a, b) {
                return a.number - b.number
            });
        // var subsURL = "/api/users"
            // var relatedSubsResponse = await axios.get(subsURL ,{ proxy: { host: 'localhost', port: 3000 }});
            // var relatedSubsResponse = {
            //     data: [],
            // }
            // var relatedSubs  = relatedSubsResponse.data;
            var ID = thisWeek[D].ID;
            user.workouts[ID] = Object.assign({}, WorkoutInstanceTemplate);       
            user.workouts[ID].Patterns = [];          
            
            for (var i = 0; i < subs.length; i ++) {
                var elem = subs[i];
                var _Type = elem.exerciseType;            
                if (_Type == "Med Ball") {_Type = "Medicine Ball";}
                else if (_Type == "Vert Pull") {_Type = "UB Vert Pull";} 	
                var eName = ExerciseDict[_Type][user.level].name;
                var userPattern = elem.patternFormat;
                var findVideo = await Video.search(eName, false); 
                if (findVideo) {
                    userPattern.hasVideo = true;
                    userPattern.videoURL = findVideo.url;
                }            
                userPattern.name = eName;
                user.workouts[ID].Patterns.push(userPattern);
            }

            user.workouts[ID].Week = W;
            user.workouts[ID].Day = D;
            user.workouts[ID].ID = ID;
            user.workouts[ID].Date = workoutDates[ID - 1];
            if (user.workouts[ID].Date >= thisDate && !user.currentWorkoutID) {
                user.currentWorkoutID = ID;
            }
            user.changed("workouts", true);
            await user.save();
            // console.log("192", user.workouts);
        }
    }
        //  user.workouts[13] = WorkoutInstanceTemplate;
        // Workout Completion Code
        //  missedWorkouts(user, new Date(2018, 02, 15, 00, 0, 0, 0), new Date(2018, 02, 22, 00, 0, 0, 0));
    await user.save();
        console.log("USER CREATED");
    return
        // console.log("User.workouts: ", user.workouts);
		// console.log("# of workoutDates: ", user.workoutDates.length);
    //  })
    //  .then(() => {
    //     //  console.log("User PROMISE RESOLVED");
    //  })
    //  return
}

module.exports = {
    CreateUser,
    SetUser,
}

var Patterns = [];

// if (!WorkouthasData) {};


// var templateResponse = await axios.get(templateAPIURL
//     ,{ proxy: { host: '127.0.0.1', port: 3000 }}
// );
// var thisTemplate  = templateResponse.data;

// var subsAPIURL = templateAPIURL + '/subworkouts';
// var subData = await axios.get(subsAPIURL
//     ,{ proxy: { host: '127.0.0.1', port: 3000 }}
// );
// var thisSubs = subData.data;						
// // console.log("thisSubs", thisSubs);	
// thisSubs.forEach(elem => {
//     var _Type = elem.exerciseType;
//     if (_Type == "Med Ball") {_Type = "Medicine Ball";}
//     else if (_Type == "Vert Pull") {_Type = "UB Vert Pull";} 	
//     var eName = ExerciseDict[_Type][req.session.User.level].name;
//     var userPattern = elem.patternFormat;
    
//     userPattern.name = eName;
//     req.session.User.workouts[TemplateID].Patterns.push(userPattern);
//     req.session.User.save();
// });