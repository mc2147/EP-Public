var models = require('../models');
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

Exercise_Types = ["UB Hor Push", "UB Vert Push", "UB Hor Pull", "UB Vert Pull", "Hinge", "Squat", "LB Uni Push", "Ant Chain", "Post Chain",
"Carry", "Iso 1", "Iso 2", "Iso 3", "Iso 4"];

ExerciseDict["Types"] = Exercise_Types;

var ExerciseObjects = {}

for (var N in CSVRows) {
    var RowSplit = CSVRows[N].split(",");
    for (var K = 0; K < ETypeList.length; K++) {
        var EType = ETypeList[K];
        if (!(EType in ExerciseObjects)) {
            ExerciseObjects[EType] = {};
            ExerciseObjects[EType][N] = {name: RowSplit[K], bodyweight: false};
            if (EType == "UB Vert Pull") {
                ExerciseObjects["UB Vert Pull"] = {};
                ExerciseObjects["UB Vert Pull"][N] = {name: RowSplit[K], bodyweight: false};                
            }
        }
        else {
            ExerciseObjects[EType][N] = {name: RowSplit[K], bodyweight: false};            
            ExerciseObjects["UB Vert Pull"][N] = {name: RowSplit[K], bodyweight: false};                
        }
    }
}


ExerciseObjects["UB Hor Pull"][3].bodyweight = true;
ExerciseObjects["UB Hor Pull"][6].bodyweight = true;
ExerciseObjects["UB Hor Pull"][9].bodyweight = true;
ExerciseObjects["UB Hor Pull"][12].bodyweight = true;
ExerciseObjects["UB Hor Pull"][14].bodyweight = true;
ExerciseObjects["UB Vert Pull"][7].bodyweight = true;
ExerciseObjects["UB Vert Pull"][9].bodyweight = true;
ExerciseObjects["UB Vert Pull"][10].bodyweight = true;
ExerciseObjects["UB Vert Pull"][11].bodyweight = true;
ExerciseObjects["UB Vert Pull"][12].bodyweight = true;
ExerciseObjects["UB Vert Pull"][14].bodyweight = true;
ExerciseObjects["UB Vert Pull"][18].bodyweight = true;

ExerciseObjects["LB Uni Push"][4].bodyweight = true;

for (var K in ExerciseObjects["Ant Chain"]) {
    if (K != 3 && K != 8 && K != 12) {
        ExerciseObjects["Ant Chain"][K].bodyweight = true;
    }
}

for (var K in ExerciseObjects["Post Chain"]) {
    if (K == 2 || K == 4 || K == 6 || K == 11 
    || ExerciseObjects["Post Chain"][K].name == "GHR"
    || ExerciseObjects["Post Chain"][K].name == "Nordic Ham") {
        ExerciseObjects["Post Chain"][K].bodyweight = true;
    }
}

for (var I = 1; I <= 25; I ++) {
    ExerciseObjects["RFD Unload 1"][I].bodyweight = true;
    ExerciseObjects["RFD Unload 2"][I].bodyweight = true;
}

ExerciseDict["Exercises"] = ExerciseObjects;

var count = 0;
for (var EType in ExerciseDict["Exercises"]) {
    for (var Level in ExerciseDict["Exercises"][EType]) {
        count ++;
        console.log(Exercise, Level);
        Exercise.findOrCreate({
            where: {
                type: EType,
                level: Level
            }
        }).spread((exercise, created) => {
            var exerciseJSON = ExerciseDict["Exercises"][exercise.type][exercise.level];
            exercise.name = exerciseJSON.name;
            exercise.bodyweight = exerciseJSON.bodyweight;
            exercise.save();
        });
    }
}
console.log(count);


module.exports = {
    ExerciseDict,
};


