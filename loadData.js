var models = require('./models');
var Exercise = models.Exercise;
var WorkoutTemplate = models.WorkoutTemplate;
var SubWorkoutTemplate = models.SubWorkoutTemplate;
var User = models.User;
var Group1WDtoID = models.Group1WDtoID;

var ETypeString =  "UB Hor Push,UB Vert Push,UB Hor Pull,UB Vert Pull,Hinge,Squat,LB Uni Push,Ant Chain,Post Chain,Carry,Iso 1,Iso 2,Iso 3,Iso 4,RFD Load,RFD Unload 1,RFD Unload 2,Medicine Ball";

var CSVRows = {
    1: "DB Bench Press,KB/DB neutral 1/2 Kn OHP,DB Row,CC Neutral Pulldown,DB RDL,Goblet Squat to Box,1L Leg Press,Deadbug,DB Hip Thrust,DB Farmer Carry,DB Biceps Curl,,CC Face Pull,DB Lateral Raise,,,,",
    2: "DB Floor Press,DB Seated OHP,CC neutral Row,CC 1A 1/2 Kn Pulldown,DB Pause RDL,Goblet Box Squat,DB Reverse Lunge,Reverse Crunch, Slider Hamstring Curl,Suitcase Carry,DB Hammer Curl,,Band Pullapart,BB OH Shrug,,,,",
    3: "DB Alt Bench Press,Standing OHP,>45° Inverted Row,CC Pro Pulldown,BB RDL,Goblet Squat,DB Split Squat,CC 1/2 Kn Pallof Press,DB Hip Thrust,KB Rack Carry,BB Curl,,CC Face Pull,DB Lateral Raise,,,,",
    4: "DB Alt Floor Press,Alternating Seated OHP,CC Pro Row,CC 1A Tempo Pulldown,DB Tempo RDL,KB/DB Front Squat,Pistol Box Squat,Banded deadbug,SB Hamstring Curl,Trap Bar Carry,CC Reverse Curl,,Band Pullapart,BB OH Shrug,,,,",
    5: "DB 1A Bench Press,KB BU 1/2 Kneeling OHP,DB Tempo Row,CC Sup Pulldown,BB Pause RDL,Pause Goblet Squat,DB Walking Lunge,Reverse Crunch,BB Hip Thrust,Handle Carry,DB Incline Curl,,CC Face Pull,DB Lateral Raise,,,,",
    6: "BB Bench Press,BB Tall Kn STR press,<45° Tempo Inv Row  ,CC Wide grip Pulldown,Trap Bar Deadlift ,KB/DB Pause Front Squat,DB Bulgarian Split Squat,Leg Raise,1L Hip Thrust,DB Carry,DB Biceps Curl,CC Triceps Pushdown,CC Face Pull,DB Lateral Raise,BB Power Pos J Shrug,Pause Box Jump,Pause Bound,CM Tall Kn OH Slam",
    7: "DB 1A Floor Press,BB stand OHP,CC Pause Row,Neutral negative pullups,BB Tempo RDL,Tempo Goblet Squat,1A OH Reverse Lunge,Kneel 1A Slideout,Slider 1L Ham Curl,Suitcase Carry,DB Hammer Curl,DB Skullcrusher,Supine Band Pullapart,Prone YTI,BB Power Pos High Pull,Pause Broad Jump,CM Bound,Cont Tall Kn OH Slam",
    8: "DB Incline Press,1A seated OHP,BB Elevated Pendlay,CC Pro Tempo Pulldown,BB Rack Pull,BB High Bar Box Squat,BB Split Squat ,CC Tall Kn Pallof Press,DB SL Hip Thrust,KB Rack Carry,BB Curl,DB OH Ext,CC Face Pull,DB Lateral Raise,BB Hang J Shrug,CM Box Jump,Cont Bound,Squat to Throw",
    9: "BB Floor Press,BB Stand STR press,Weighted Inverted Row,Sup neg pullups,BB Deadlift,KB/DB Tempo Front Squat,DB Pistol Box Squat,Banded alt leg raise,SB SL Ham Curl,Trap Bar Carry,CC Reverse Curl,CC Rope Pressdown,Band Pullapart,Prone YTI,BB Hang High Pull,CM Broad Jump,CM Bound to Box,1/2 Kn CM Chest Pass",
    10: "DB Incline Alt Press,BB 1/2 Kn OHP,Pendlay Row,Pro neg pullups,Snatch Grip RDL,BB Squat,BB Bulgarian Split Squat,Hanging Knee Tuck,DB SL Hip Thrust,Handle Carry,DB Incline Curl,DB/BB Decline Skull,CC Face Pull,DB Lateral Raise,BB Clean Pull,Continuous Broad Jump,CM 45deg Bound,Tall Kn Cont Chest Pass",
    11: "BB Pause Bench Press,DB 1A Stand Press,BB Bent Row,Neutral Pullups,BB Snatch Grip Pause RDL,BB Box Front Squat,BB Zercher Split Squat,Banded deadbug,BW SL RDL,DB Carry,KB Biceps Curl,CC Pressdown,CC High Face Pull,DB Lat to Front Raise,DB Snatch,Continuous Hurdle Jump,Pause Hop,CM Stand OH Slam",
    12: "BB Pause Floor Press,BB Stand Javelin Press, <45° Weighted Inverted Row,Supinated Pullups,BB Sumo Deadlift ,BB High Bar Pause Squat,KB 1A OH Rev Lunge w/ step,CC Low Split Pallof Press,GHR,Suitcase Carry,DB Hammer Curl,DB Skullcrusher,Supine Band Pullapart,Incline YTI,BB Hang Power Clean,Pause Lat Box Jump,CM Hop,CM Tall Split OH Throw",
    13: "BB Incline Press,DB seated OHP,DB Row,Neutral Weighted Negatives,BB Deficit RDL,BB Front Squat,DB Walking Lunge,Buzzsaw,1DB SL RDL,KB Rack Carry,BB Curl,DB OH Ext,CC Low Face Pull,DB Lat to Front Raise,DB Snatch,CM Lat Box Jump,Pause Lat Bound,Squat to Throw",
    14: "BB Close Grip Floor Press,BB Tall Kn STR press,Weighted Feet Elev Inv Row ,Pronated Pullups,Trap Bar Deadlift,BB High Bar Tempo Squat,DB Bulgarian Split Squat,Ab Wheel Rollout,GHR,Trap Bar Carry,BB Reverse Curl,CC Rope Pressdown,FR Band Pullapart,Incline YTI,BB Snatch Pull,Depth Jump,CM Lat Bound,Stand CM OH Rot Slam",
    15: "BB Pause Incline Press,DB alt stand OHP,BB Pendlay Row,Sup Weighted Neg ,BB Deficit Pause RDL,BB Pause Front Squat,BB Zercher Bulgarian Split Squat,1L Buzzsaw,2DB SL RDL,Handle Carry,DB Incline Curl,DB/BB Decline Skull,CC Face Pull,DB Lat to Front Raise,BB Power Clean,Pause Lat Hurdle Jump,Cont 45deg Bound,Tall Kn Chest Pass Fallout",
    16: "BB Close Grip Press,BB stand OHP,T Bar Row,Pro Weighted Neg,BB Deadlift,BB Frankenstein Squat,DB Bulgarian Split Squat,Dragon Fly,Nordic Ham,Suitcase Carry,DB Biceps Curl,CC Pressdown,CC High Face Pull,DB Lateral Raise,DB Snatch,CM Lat Hurdle Jump,Cont Hop,Approach OH Throw",
    17: "DB Incline Press,DB Push Press,DB Tempo Row,Weighted Pull Neu,BB Deficit Tempo RDL,BB Low Bar Box Squat,Zercher Split Squat,Hanging Leg Raise,1 DB SL RDL,Trap Bar Carry,KB Hammer Curl,DB Skullcrusher,Band Pullapart,Hinge YTI,BB Clean Pull,Depth Box Jump,Pause Med Hop,Cont OH Slam",
    18: "BB Pause Bench Press,BBTall Kn STR Press,BB Tempo Bent Row ,Wide Grip Pullups,BB Sumo Deadlift,SSB Squat,BB Bulgarian Split Squat,Ab Wheel Rollout,Nordic Ham,Handle Carry,BB Curl,DB OH Ext,CC Sup Face Pull,DB Lateral Raise,BB Hang Snatch High Pull,Pause 90deg Box Jump,Cont Lat Bound,CM Rot Hip Toss",
    19: "DB Alt Incline Press,BB Push Press,BB Landmine Row,Weighted Pull Sup,BB Pause Deadlift,BB Pause Frankenstein Squat,BB Front Split Squat ,Ecc Dragon Flag,BB SL RDL,Trap Bar Carry,BB Reverse Curl,CC Rope Pressdown,Supine Band Pullapart,Hinge YTI,BB Power Clean,CM 90deg Box Jump,CM Med Hop,Stand Cont OH Rot Slam",
    20: "BB Pause Floor Press,BB 1/2 Kn OHP,BB Pendlay Row,Weighted Pull Pro,BB Snatch Grip RDL,BB Low Bar Squat,BB Zercher Bulgarian Split Squat,W Raise,Nordic Ham,Handle Carry,KB Incline Curl,DB/BB Decline Skull,CC Face Pull,DB Lateral Raise,BB Hang Snatch,Pause 90deg Hurdle Jump,CM 90deg Bound,Figure 8 Rot Shoulder Toss",
    21: "BB Incline Press,BB Javelin Press,T Bar Row,Tabletop Pull Neutral,BB Deficit Deadlift,SSB Pause Squat,DB Bulgarian Split Squat,Hanging Leg Raise,Nordic Ham,Suitcase Carry,DB Biceps Curl,CC Pressdown,CC Face Pull,TRX YTI,DB Snatch,Depth Box Jump,CM Hop to Box,Squat to Throw",
    22: "BB Close Grip Floor Press,BB 1/2 Kn OHP,DB Tempo Row,Weighted Neg Sup,BB Rack Pull,BB Pause Low Bar Squat,BB Zercher Split Squat,W Raise ,2DB SL RDL,Trap Bar Carry,DB Hammer Curl,DB Skullcrusher,Scap Pullup,DB Lat to Front Raise,BB Clean Pull,CM 90deg Hurdle Jump,Cont 90deg Bound,Cont OH Slam",
    23: "BB Pause Incline Press,BB stand STR press,BB Tempo Bent Row ,Tabletop Pull Sup,Trap Bar Deadlift,SSB Squat,BB Bulgarian Split Squat,Dragon Flag,Weighted Nordic Ham,Handle Carry,BB Curl,DB OH Ext,CC Sup Face Pull,TRX YTI,BB Hang Snatch,Lat Depth Box Jump,Pause Lat Hop,Approach OH Throw",
    24: "BB Close Grip Press,BB Stand OHP,Landmine Tempo Row,Weight Neg Pro,BB Deadlift,BB Tempo Front Squat,BB Front Split Squat ,Ab Wheel Rollout,BB SL RDL,Trap Bar Carry,BB Reverse Curl,CC Rope Pressdown,Scap Pullup,DB Lat to Front Raise,BB Snatch Pull,90deg Depth Box Jump,Cont Med Hop,Tall Kn Chest Pass Fallout",
    25: "BB Bench Press,BB Push Press,BB Pendlay Row,Tabletop Pull Pro,BB Sumo Deadlift,BB Low Bar Squat,BB Zercher Bulgarian Split Squat,Dragon Flag,Weighted Nordic Ham,Handle Carry,KB Incline Curl,DB/BB Decline Skull,CC Face Pull,TRX YTI,BB Power Clean,Cont 90deg Hurdle Jump,Cont 90deg Med-Lat Hop,Figure 8 Rot Shoulder Toss",
}

var ETypeList = ETypeString.split(",");
var L1Exercises = CSVRows[1].split(",");

var ExerciseDict = {};


for (var N in CSVRows) {
    var RowSplit = CSVRows[N].split(",");
    // console.log("Level " + N + " " + RowSplit.length + " Exercises");
    // ExerciseDict[N] = {}
    for (var K = 0; K < ETypeList.length; K++) {
        var EType = ETypeList[K];
        if (!(EType in ExerciseDict)) {
            ExerciseDict[EType] = {};
            ExerciseDict[EType][N] = {name: RowSplit[K], bodyweight: false};
        }
        else {
            ExerciseDict[EType][N] = {name: RowSplit[K], bodyweight: false};            
        }
        // console.log("L" + N + ": " + EType + ", " + RowSplit[K]);
        // ExerciseDict[N][EType] = {name: RowSplit[K], bodyweight: false};
    }
}


ExerciseDict["UB Hor Pull"][3].bodyweight = true;
ExerciseDict["UB Hor Pull"][6].bodyweight = true;
ExerciseDict["UB Hor Pull"][9].bodyweight = true;
ExerciseDict["UB Hor Pull"][12].bodyweight = true;
ExerciseDict["UB Hor Pull"][14].bodyweight = true;

ExerciseDict["UB Vert Pull"][7].bodyweight = true;
ExerciseDict["UB Vert Pull"][9].bodyweight = true;
ExerciseDict["UB Vert Pull"][10].bodyweight = true;
ExerciseDict["UB Vert Pull"][11].bodyweight = true;
ExerciseDict["UB Vert Pull"][12].bodyweight = true;
ExerciseDict["UB Vert Pull"][14].bodyweight = true;
ExerciseDict["UB Vert Pull"][18].bodyweight = true;

ExerciseDict["LB Uni Push"][4].bodyweight = true;

for (var K in ExerciseDict["Ant Chain"]) {
    if (K != 3 && K != 8 && K != 12) {
        ExerciseDict["Ant Chain"][K].bodyweight = true;
    }
}

for (var K in ExerciseDict["Post Chain"]) {
    if (K == 2 || K == 4 || K == 6 || K == 11 
    || ExerciseDict["Post Chain"][K].name == "GHR"
    || ExerciseDict["Post Chain"][K].name == "Nordic Ham") {
        ExerciseDict["Post Chain"][K].bodyweight = true;
    }
}

for (var I = 1; I <= 25; I ++) {
    // console.log(I);
    ExerciseDict["RFD Unload 1"][I].bodyweight = true;
    ExerciseDict["RFD Unload 2"][I].bodyweight = true;
}

// console.log(ExerciseDict);

for (var E in ExerciseDict) {
    var ELDict = ExerciseDict[E];
    for (var L in ELDict) {
        // console.log()
        Exercise.findOrCreate({
            where: {
                type: E,
                level: L
            }
        }).spread((result, created) => {
            var ELObject = ExerciseDict[result.type][result.level];
            var name = ELObject.name;
            var bodyweight = ELObject.bodyweight;
            result.name = name;
            result.bodyweight = bodyweight;
            result.save();
            // console.log(result.level, result.type, result.name, bodyweight);
        })
    }
}

module.exports = {
    ExerciseDict,
};


// BodyWeight Exercises


// console.log(ETypeList, ETypeList.length);
// console.log(L1Exercises, L1Exercises.length);

// const readline = require('readline');
// const fs = require('fs');

// const rl = readline.createInterface({
//   input: fs.createReadStream('sample.txt'),
//   crlfDelay: Infinity
// });

// rl.on('line', (line) => {
//   console.log(`Line from file: ${line}`);
// });

// // Level Group Workouts
// var Group1Workouts = require('./WorkoutGroup1');
// var Group2Workouts = require('./WorkoutGroup2');
// var Group3Workouts = require('./WorkoutGroup3');
// var Group4Workouts = require('./WorkoutGroup4');

// console.log("testing loadData.js");

// // Global Fixed References
// var DayValue = 24*3600*1000;
// // Workout Weeks
// var G1_Weeks = Group1Workouts.Group1Workouts.Week;
// var G2_Weeks = Group2Workouts.Group2Workouts.Week;
// // var G3_Weeks = Group3Workouts.Group3Workouts.Week;
// // var G4_Weeks = Group4Workouts.Group1Workouts.Week;


// return
// // Group 1 Workouts
// for (var W in G1_Weeks) {
//     var Week = Weeks[W];
//     // console.log("test");
//     // console.log(Weeks[W]);
//     var Days = Week.Day;
//     for (var D in Days) {
//         // console.log("   Day: " + D);
//         // console.log("   Workout: ");
//         // console.log(Days[D].Patterns);
//         // console.log("Weeks: " + W + " Days: " + D);
//         CreateWorkoutTemplate(1, W, D, 0);
//     }
//     // console.log(Group1Workouts.Week[W]);
// }


// function CreateWorkoutTemplate(LGroup, Week, Day, BlockNum) {
//     var _Template = Group1Workouts.Group1Workouts.Week[Week].Day[Day];
//     var _TemplatePatterns = _Template.Patterns; //Dictionary
//     var _TemplateID = _Template.ID;
//     // console.log(_TemplateID);
//     // console.log(_Template);
//     // console.log("Workout Template Created: " + Week + ", " + Day);
//     // console.log(WorkoutTemplate);
//     // return;

//     WorkoutTemplate.findOrCreate(
//        {
//         where: {
//             levelGroup: LGroup,
//             week: Week,
//             day: Day,
//             block: BlockNum
//         }
//     }).spread((template, created) => {
//         // console.log("template created: " + template.week + ", " + template.day);
//         // console.log("Patterns: "); 
//         // console.log(_TemplatePatterns);
//         if (created) {
//             // console.log(template);        
//         }
//         else {
//             template.number = _TemplateID;
//             for (var K in _TemplatePatterns) {
//                 var Sub = _TemplatePatterns[K];
//                 var ID = K; //ID is key (1-6)
//                 var ExerciseName = Sub.ExerciseType;
//                 var Sets = Sub.Sets;
//                 var Reps = Sub.Reps;
//                 var RPE = Sub.RPE;
//                 var Deload = Sub.Deload;
//                 var Alloy = Sub.Alloy;
//                 var Description = ExerciseName + " " + Sets + " " + Reps + " RPE: " + RPE + " Alloy: " + Alloy + " Deload: " + Deload;
//                 SubWorkoutTemplate.findOrCreate({
//                     where: {
//                         number: ID, 
//                         fk_workout: template.id, 
//                     }
//                 }).spread((result, created) => {
//                     var Key = result.number;
//                     var SubSample = _TemplatePatterns[Key];
//                     result.exerciseType = SubSample.ExerciseType;
//                     result.sets = SubSample.Sets;
//                     result.reps = SubSample.Reps;
//                     result.RPE = SubSample.RPE;
//                     result.alloy = SubSample.Alloy;
//                     result.alloyreps = SubSample.AlloyReps;
//                     result.deload = SubSample.Deload;
//                     if (result.deload) {
//                         result.type = 'deload';
//                     }
//                     if (result.alloy) {
//                         result.type = 'alloy';
//                     } 
//                     // console.log("subWorkout Type: " + result.type);
//                     // result.description = result.exerciseType + " " + result.sets 
//                     // + " x " + result.reps + " RPE: " + result.RPE + " Alloy: " + result.alloy 
//                     // + " Deload: " + result.deload + " Type: " + result.type;
//                     // console.log("Subworkout: " + result.number + " workout: " + result.fk_workout + " " + result.exerciseType);
//                     // console.log("   Description: " + result.description);
//                     result.save();
//                     template.save();
//                 });            
//             }
//         }
//     })        
// }


// var StatTemplate = {
//     "UB Hor Push": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
//     "UB Vert Push": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
//     "UB Hor Pull": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
//     "UB Vert Pull": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
//     "Hinge": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""},
//     "Squat": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
//     "LB Uni Push": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
//     "Ant Chain": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
//     "Post Chain": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
//     "Carry": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
//     "Iso 1": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
//     "Iso 2": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
//     "Iso 3": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
//     "Iso 4": {Status: Alloy.None, Max: 100, LastSet: "", Name: ""}, 
//     "Level Up": {
//         Status: Alloy.None, 
//         Squat: Alloy.None,
//         UBHorPush: Alloy.None,
//         Hinge: Alloy.None,
//     },
// };

// function dateOnly (dateInput) {
//     var returnDate = dateInput;
//     returnDate.setHours(0);
//     returnDate.setMinutes(0);
//     returnDate.setSeconds(0);
//     returnDate.setMilliseconds(0);
//     return returnDate;
// }

// function missedWorkouts (user, missedDate, newStartDate) {
//     // missedWorkouts(user, new Date(2018, 02, 09, 00, 0, 0, 0), new Date(2018, 02, 15, 00, 0, 0, 0));
//     var thisDate = newStartDate;
//     var workoutDates = user.workoutDates;
//     // workoutDates.sort();
//     // console.log("\nMISSED WORKOUTS: ");
//     // console.log("   missedDate: " + missedDate);
//     // console.log("   thisDate: " + thisDate);
//     // console.log("\n");
//     var missedDates = [];
//     var shiftedDates = [];
//     var completedDates = [];
//     var allRemainingWorkoutDates = [];

//     var newStartDate;
//     // console.log(workoutDates);
//     var shiftPoint = 0;
//     var missedPoint = 0;
    
//     for (var WD = 0; WD < workoutDates.length; WD ++) {
//         var workoutID = WD + 1;
//         var _Date = workoutDates[WD];
//         // console.log("Date 300: " + _Date);
//         // console.log(missedDate);
//         if (dateOnly(_Date) >= dateOnly(missedDate)
//         && dateOnly(_Date) < dateOnly(thisDate)) {
//             missedDates.push(_Date);
//         }
//         else if (dateOnly(_Date) >= dateOnly(thisDate)) {
//             shiftedDates.push(_Date);
//             // newStartDate = _Date;
//             // break;
//         }
//         else if (dateOnly(_Date) < dateOnly(missedDate)) {
//             completedDates.push(_Date);
//         }
//     }

//     shiftPoint = completedDates.length;
//     missedPoint = shiftPoint + missedDates.length;

//     // Shallow copy only for first level with Object.assign
//     allRemainingWorkoutDates = missedDates.concat(shiftedDates);
//     var nextWorkoutDate = shiftedDates[0];
//     // console.log("\ndifference: " + Math.round((dateOnly(nextWorkoutDate).getTime() - dateOnly(missedDates[0]).getTime())/DayValue) + "\n");
    
//     var newWorkoutDates = [];
//     var shiftedDays = Math.round((dateOnly(nextWorkoutDate).getTime() - dateOnly(missedDates[0]).getTime())/DayValue);
//     var shiftedTimeVal = shiftedDays*DayValue;

//     for (var WD = 0; WD < allRemainingWorkoutDates.length; WD ++) {
//         var _Date = allRemainingWorkoutDates[WD];
//         var newDate = new Date(_Date.getTime() + shiftedTimeVal);
//         newWorkoutDates.push(newDate);       
//     }
//     newWorkoutDates = completedDates.concat(newWorkoutDates);
//     // console.log(workoutDates);
//     // console.log("shiftedTimeVal: " + shiftedTimeVal);
//     // console.log(newWorkoutDates);
    
//     // console.log("old workout dates: " + workoutDates.length);
//     for (var x = 0; x < workoutDates.length; x ++) {
//         // console.log(x);
//         // console.log(workoutDates[x], "Workout #: " + (x + 1));
//         // console.log("Workout #: " + (x + 1));
//     }
//     // console.log("\nmissedDate: " + missedDate);
//     // console.log("new start date: " + thisDate);
//     // console.log("\nNew Workout Dates:"); 
//     for (var x = 0; x < newWorkoutDates.length; x ++) {
//         // console.log(newWorkoutDates[x], "Workout #: " + (x + 1));
//         // console.log("Workout #: " + (x + 1));
//         if (x == completedDates.length - 1) {
//             // console.log("   Shift Starts");
//         }
//         else if (x == missedPoint - 1) {
//             // console.log("   Missed Starts");
//         }
//     }

//     // console.log("\n");    
//     return newWorkoutDates;
// }

// // db.sync({force: true});
// Group1WeekDays = {
//     1: {
//         1: 1,
//         2: 2,
//         3: 3,
//     }, 
//     2: {
//         1: 4,
//         2: 5,
//         3: 6,
//     }, 
//     3: {
//         1: 7,
//         2: 8,
//         3: 9,
//     }, 
//     4: {
//         1: 10,
//         2: 11,
//         3: 12,
//     }
// };
 
// var WorkoutElemTemplate = {
//     ID: null,
//     Week: null,
//     Day: null,
//     Date: null,
//     Completed: false,
//     Patterns: [],
// }

// User.findOrCreate(
//    {
//     where: {
//         id: 1,
//     }
// }).spread((user, created) => {
//     if (created) {
//         // console.log("user created!! " + user);        
//     }
//     // console.log("user exists: " + user);
//     user.currentWorkout = {
//         ID: 1,
//         Week: 1,
//         Day: 1,
//         Patterns: []
//     };        
//     user.stats = StatTemplate;
//     user.stats["TestList"] = [1, 2, 3, 4, 5];
//     user.workouts = {};
//     // user.workouts["Current"] = {Patterns: []};
//     user.thisPatterns = [];
// //  Current
//     user.workouts.thisPatterns = [];
//     user.workouts.patternsLoaded = false;
// //  Instance variables
//     user.level = 1; 
//     // console.log(new Date(Date.now() - 10*DayValue));
//     var oldDate = new Date(Date.now() - 10*DayValue);
//     var thisDate = new Date(Date.now());

//     var workoutDates = Generate_Workouts(oldDate, [1, 3, 5], 1, "", 12);
//     user.workoutDates = workoutDates;
//     // user.workoutDates.push(thisDate);
//     // console.log("new user workoutDates: " + user.workoutDates);
//     // Sort workouts by LGroups and blocks -> ID
//     for (var W in Group1WeekDays) {
//         var thisWeek = Group1WeekDays[W];
//         for (var D in thisWeek) {
//             var ID = thisWeek[D];
//             user.workouts[ID] = Object.assign({}, WorkoutElemTemplate);
//             // user.workouts[ID] = WorkoutElemTemplate;
//             // user.workouts[W][D] = Object.assign({}, WorkoutElemTemplate);
//             // var thisElem = user.workouts[W][D];
//             var thisElem = user.workouts[ID];
//             // thisElem = Object.assign({}, WorkoutElemTemplate);
//             // console.log(user.workouts[W][D]);
//             user.workouts[ID].Week = W;
//             user.workouts[ID].Day = D;
//             user.workouts[ID].ID = ID;
//             user.workouts[ID].Date = workoutDates[ID - 1];
//             // console.log(WorkoutElemTemplate);
//             // console.log("W: " + W + ", D: " + D + " ID: " + ID);
//             // console.log(user.workouts[ID]);
//             user.save();
//         }
//     }

//     // console.log(user.workouts);
//     // workoutDates.sort();
//     for (var i = 0; i < workoutDates.length; i++) {
//         var _Date = workoutDates[i]; 
//         var workoutID = i + 1;
//         // console.log("Date 403: " + _Date);
//         // console.log("i 370: " + i + " ID: " + workoutID);
//         if (user.workouts[workoutID].Date < thisDate) {
//             // user.workouts[workoutID].Completed = true;            
//         }
//         else {
//             user.currentworkoutID = workoutID;
//             break;
//         }
//     }
//     // console.log("workoutDates: " + workoutDates.length);
//     // console.log("thisDate: " + thisDate);
//     // console.log(workoutDates);
//     // console.log(user.workouts);
//     // console.log("currentworkoutID: " + user.currentworkoutID);
//     // console.log("Current Workout: ");
//     // console.log(user.workouts[user.currentworkoutID]);
//     // missedWorkouts(user, new Date(2018, 02, 09, 00, 0, 0, 0), new Date(2018, 02, 15, 00, 0, 0, 0));
//     missedWorkouts(user, new Date(2018, 02, 15, 00, 0, 0, 0), new Date(2018, 02, 22, 00, 0, 0, 0));
// //  Variable assignment ends 
//     user.save();
//     // console.log("user.stats: " + user.stats);
//     for (var K in user.stats) {
//         // console.log(K + " : " + String(user.stats[K]));        
//         // console.log(user.stats[K]);
//     }
// })
