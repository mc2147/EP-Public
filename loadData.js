// Required Globals
var models = require('./models');
var Exercise = models.Exercise;
var WorkoutTemplate = models.WorkoutTemplate;
var SubWorkoutTemplate = models.SubWorkoutTemplate;
var User = models.User;
// Level Group Workouts
var Group1Workouts = require('./WorkoutGroup1');
var Group2Workouts = require('./WorkoutGroup2');
var Group3Workouts = require('./WorkoutGroup3');
var Group4Workouts = require('./WorkoutGroup4');

console.log("testing loadData.js");

// Global Fixed References
var DayValue = 24*3600*1000;
// Workout Weeks
var G1_Weeks = Group1Workouts.Group1Workouts.Week;
var G2_Weeks = Group2Workouts.Group2Workouts.Week;
// var G3_Weeks = Group3Workouts.Group3Workouts.Week;
// var G4_Weeks = Group4Workouts.Group1Workouts.Week;


return
// Group 1 Workouts
for (var W in G1_Weeks) {
    var Week = Weeks[W];
    // console.log("test");
    // console.log(Weeks[W]);
    var Days = Week.Day;
    for (var D in Days) {
        // console.log("   Day: " + D);
        // console.log("   Workout: ");
        // console.log(Days[D].Patterns);
        // console.log("Weeks: " + W + " Days: " + D);
        CreateWorkoutTemplate(1, W, D, 0);
    }
    // console.log(Group1Workouts.Week[W]);
}


function CreateWorkoutTemplate(LGroup, Week, Day, BlockNum) {
    var _Template = Group1Workouts.Group1Workouts.Week[Week].Day[Day];
    var _TemplatePatterns = _Template.Patterns; //Dictionary
    var _TemplateID = _Template.ID;
    // console.log(_TemplateID);
    // console.log(_Template);
    // console.log("Workout Template Created: " + Week + ", " + Day);
    // console.log(WorkoutTemplate);
    // return;

    WorkoutTemplate.findOrCreate(
       {
        where: {
            levelGroup: LGroup,
            week: Week,
            day: Day,
            block: BlockNum
        }
    }).spread((template, created) => {
        // console.log("template created: " + template.week + ", " + template.day);
        // console.log("Patterns: "); 
        // console.log(_TemplatePatterns);
        if (created) {
            // console.log(template);        
        }
        else {
            template.number = _TemplateID;
            for (var K in _TemplatePatterns) {
                var Sub = _TemplatePatterns[K];
                var ID = K; //ID is key (1-6)
                var ExerciseName = Sub.ExerciseType;
                var Sets = Sub.Sets;
                var Reps = Sub.Reps;
                var RPE = Sub.RPE;
                var Deload = Sub.Deload;
                var Alloy = Sub.Alloy;
                var Description = ExerciseName + " " + Sets + " " + Reps + " RPE: " + RPE + " Alloy: " + Alloy + " Deload: " + Deload;
                SubWorkoutTemplate.findOrCreate({
                    where: {
                        number: ID, 
                        fk_workout: template.id, 
                    }
                }).spread((result, created) => {
                    var Key = result.number;
                    var SubSample = _TemplatePatterns[Key];
                    result.exerciseType = SubSample.ExerciseType;
                    result.sets = SubSample.Sets;
                    result.reps = SubSample.Reps;
                    result.RPE = SubSample.RPE;
                    result.alloy = SubSample.Alloy;
                    result.alloyreps = SubSample.AlloyReps;
                    result.deload = SubSample.Deload;
                    if (result.deload) {
                        result.type = 'deload';
                    }
                    if (result.alloy) {
                        result.type = 'alloy';
                    } 
                    // console.log("subWorkout Type: " + result.type);
                    // result.description = result.exerciseType + " " + result.sets 
                    // + " x " + result.reps + " RPE: " + result.RPE + " Alloy: " + result.alloy 
                    // + " Deload: " + result.deload + " Type: " + result.type;
                    // console.log("Subworkout: " + result.number + " workout: " + result.fk_workout + " " + result.exerciseType);
                    // console.log("   Description: " + result.description);
                    result.save();
                    template.save();
                });            
            }
        }
    })        
}


var StatTemplate = {
    "UB Hor Push": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
    "UB Vert Push": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
    "UB Hor Pull": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
    "UB Vert Pull": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
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

function dateOnly (dateInput) {
    var returnDate = dateInput;
    returnDate.setHours(0);
    returnDate.setMinutes(0);
    returnDate.setSeconds(0);
    returnDate.setMilliseconds(0);
    return returnDate;
}

function missedWorkouts (user, missedDate, newStartDate) {
    // missedWorkouts(user, new Date(2018, 02, 09, 00, 0, 0, 0), new Date(2018, 02, 15, 00, 0, 0, 0));
    var thisDate = newStartDate;
    var workoutDates = user.workoutDates;
    // workoutDates.sort();
    // console.log("\nMISSED WORKOUTS: ");
    // console.log("   missedDate: " + missedDate);
    // console.log("   thisDate: " + thisDate);
    // console.log("\n");
    var missedDates = [];
    var shiftedDates = [];
    var completedDates = [];
    var allRemainingWorkoutDates = [];

    var newStartDate;
    // console.log(workoutDates);
    var shiftPoint = 0;
    var missedPoint = 0;
    
    for (var WD = 0; WD < workoutDates.length; WD ++) {
        var workoutID = WD + 1;
        var _Date = workoutDates[WD];
        // console.log("Date 300: " + _Date);
        // console.log(missedDate);
        if (dateOnly(_Date) >= dateOnly(missedDate)
        && dateOnly(_Date) < dateOnly(thisDate)) {
            missedDates.push(_Date);
        }
        else if (dateOnly(_Date) >= dateOnly(thisDate)) {
            shiftedDates.push(_Date);
            // newStartDate = _Date;
            // break;
        }
        else if (dateOnly(_Date) < dateOnly(missedDate)) {
            completedDates.push(_Date);
        }
    }

    shiftPoint = completedDates.length;
    missedPoint = shiftPoint + missedDates.length;

    // Shallow copy only for first level with Object.assign
    allRemainingWorkoutDates = missedDates.concat(shiftedDates);
    var nextWorkoutDate = shiftedDates[0];
    // console.log("\ndifference: " + Math.round((dateOnly(nextWorkoutDate).getTime() - dateOnly(missedDates[0]).getTime())/DayValue) + "\n");
    
    var newWorkoutDates = [];
    var shiftedDays = Math.round((dateOnly(nextWorkoutDate).getTime() - dateOnly(missedDates[0]).getTime())/DayValue);
    var shiftedTimeVal = shiftedDays*DayValue;

    for (var WD = 0; WD < allRemainingWorkoutDates.length; WD ++) {
        var _Date = allRemainingWorkoutDates[WD];
        var newDate = new Date(_Date.getTime() + shiftedTimeVal);
        newWorkoutDates.push(newDate);       
    }
    newWorkoutDates = completedDates.concat(newWorkoutDates);
    // console.log(workoutDates);
    // console.log("shiftedTimeVal: " + shiftedTimeVal);
    // console.log(newWorkoutDates);
    
    // console.log("old workout dates: " + workoutDates.length);
    for (var x = 0; x < workoutDates.length; x ++) {
        // console.log(x);
        // console.log(workoutDates[x], "Workout #: " + (x + 1));
        // console.log("Workout #: " + (x + 1));
    }
    // console.log("\nmissedDate: " + missedDate);
    // console.log("new start date: " + thisDate);
    // console.log("\nNew Workout Dates:"); 
    for (var x = 0; x < newWorkoutDates.length; x ++) {
        // console.log(newWorkoutDates[x], "Workout #: " + (x + 1));
        // console.log("Workout #: " + (x + 1));
        if (x == completedDates.length - 1) {
            // console.log("   Shift Starts");
        }
        else if (x == missedPoint - 1) {
            // console.log("   Missed Starts");
        }
    }

    // console.log("\n");    
    return newWorkoutDates;
}

// db.sync({force: true});
Group1WeekDays = {
    1: {
        1: 1,
        2: 2,
        3: 3,
    }, 
    2: {
        1: 4,
        2: 5,
        3: 6,
    }, 
    3: {
        1: 7,
        2: 8,
        3: 9,
    }, 
    4: {
        1: 10,
        2: 11,
        3: 12,
    }
};
 
var WorkoutElemTemplate = {
    ID: null,
    Week: null,
    Day: null,
    Date: null,
    Completed: false,
    Patterns: [],
}

User.findOrCreate(
   {
    where: {
        id: 1,
    }
}).spread((user, created) => {
    if (created) {
        // console.log("user created!! " + user);        
    }
    // console.log("user exists: " + user);
    user.currentWorkout = {
        ID: 1,
        Week: 1,
        Day: 1,
        Patterns: []
    };        
    user.stats = StatTemplate;
    user.stats["TestList"] = [1, 2, 3, 4, 5];
    user.workouts = {};
    // user.workouts["Current"] = {Patterns: []};
    user.thisPatterns = [];
//  Current
    user.workouts.thisPatterns = [];
    user.workouts.patternsLoaded = false;
//  Instance variables
    user.level = 1; 
    // console.log(new Date(Date.now() - 10*DayValue));
    var oldDate = new Date(Date.now() - 10*DayValue);
    var thisDate = new Date(Date.now());

    var workoutDates = Generate_Workouts(oldDate, [1, 3, 5], 1, "", 12);
    user.workoutDates = workoutDates;
    // user.workoutDates.push(thisDate);
    // console.log("new user workoutDates: " + user.workoutDates);
    // Sort workouts by LGroups and blocks -> ID
    for (var W in Group1WeekDays) {
        var thisWeek = Group1WeekDays[W];
        for (var D in thisWeek) {
            var ID = thisWeek[D];
            user.workouts[ID] = Object.assign({}, WorkoutElemTemplate);
            // user.workouts[ID] = WorkoutElemTemplate;
            // user.workouts[W][D] = Object.assign({}, WorkoutElemTemplate);
            // var thisElem = user.workouts[W][D];
            var thisElem = user.workouts[ID];
            // thisElem = Object.assign({}, WorkoutElemTemplate);
            // console.log(user.workouts[W][D]);
            user.workouts[ID].Week = W;
            user.workouts[ID].Day = D;
            user.workouts[ID].ID = ID;
            user.workouts[ID].Date = workoutDates[ID - 1];
            // console.log(WorkoutElemTemplate);
            // console.log("W: " + W + ", D: " + D + " ID: " + ID);
            // console.log(user.workouts[ID]);
            user.save();
        }
    }

    // console.log(user.workouts);
    // workoutDates.sort();
    for (var i = 0; i < workoutDates.length; i++) {
        var _Date = workoutDates[i]; 
        var workoutID = i + 1;
        // console.log("Date 403: " + _Date);
        // console.log("i 370: " + i + " ID: " + workoutID);
        if (user.workouts[workoutID].Date < thisDate) {
            // user.workouts[workoutID].Completed = true;            
        }
        else {
            user.currentworkoutID = workoutID;
            break;
        }
    }
    // console.log("workoutDates: " + workoutDates.length);
    // console.log("thisDate: " + thisDate);
    // console.log(workoutDates);
    // console.log(user.workouts);
    // console.log("currentworkoutID: " + user.currentworkoutID);
    // console.log("Current Workout: ");
    // console.log(user.workouts[user.currentworkoutID]);
    // missedWorkouts(user, new Date(2018, 02, 09, 00, 0, 0, 0), new Date(2018, 02, 15, 00, 0, 0, 0));
    missedWorkouts(user, new Date(2018, 02, 15, 00, 0, 0, 0), new Date(2018, 02, 22, 00, 0, 0, 0));
//  Variable assignment ends 
    user.save();
    // console.log("user.stats: " + user.stats);
    for (var K in user.stats) {
        // console.log(K + " : " + String(user.stats[K]));        
        // console.log(user.stats[K]);
    }
})
