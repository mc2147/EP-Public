const Sequelize = require('sequelize');
var data = require('../data');
var models = require('./index');
var WorkoutTemplate = models.WorkoutTemplate;
var SubWorkoutTemplate = models.SubWorkoutTemplate;

var AllWorkouts = data.AllWorkouts;

var Workouts1 = data.Workouts1;
var Workouts2 = data.Workouts2;
var Workouts3a = data.Workouts3a;
var Workouts3b = data.Workouts3b;
var Workouts4a = data.Workouts4a;
var Workouts4b = data.Workouts4b;
var AllTemplates = {
    1: Workouts1,
    2: Workouts2,    
    3: {
        1: Workouts3a,
        2: Workouts3b
    },
    4: {
        1: Workouts4a,
        2: Workouts4b
    }
}

// var Workouts3a = require("../dat")
// return
// Creating Group 1 Workouts
function DestroyAll() {
    WorkoutTemplate.destroy({
        where:{}
    });
};
function DestroyTemplates(LGroup, BlockNum) {
    return WorkoutTemplate.destroy({
        where: {
            levelGroup: LGroup,
            block: BlockNum
        },
    }) 
} 

// DestroyAll();
// WorkoutTemplate.destroy({
//     where: {
//         levelGroup: 1,
//         block: 0
//     },
// }).then(() => {
function MakeTemplates(LGroup, BlockNum) {
    var TemplateJSON = AllTemplates[LGroup];
    if (BlockNum != 0) {
        TemplateJSON = TemplateJSON[BlockNum];
    }
    if (LGroup == 3 && BlockNum == 2) {
        console.log(TemplateJSON);
    }
    // console.log("DESTROYED LINE 37");
    for (var W in TemplateJSON.Templates) {
        for (var D in TemplateJSON.Templates[W]) {
            CreateWorkoutTemplate(LGroup, W, D, BlockNum, TemplateJSON);
            // console.log("RECREATING TEMPLATE: ", W, D);
        }
    }
    
}

MakeTemplates(1, 0);
MakeTemplates(2, 0);
MakeTemplates(3, 1);
MakeTemplates(3, 2);
MakeTemplates(4, 1);
MakeTemplates(4, 2);

    // console.log("DESTROYED LINE 37");
    // for (var W in Workouts1.Templates) {
    //     for (var D in Workouts1.Templates[W]) {
    //         CreateWorkoutTemplate(1, W, D, 0, AllWorkouts[1]);
    //         console.log("RECREATING TEMPLATE: ", W, D);
    //     }
    // }
// })
// DestroyTemplates(1, 0);
// .then(() => {


// })
// Creating Group 2 Workouts
// DestroyTemplates(2, 0).then(() => {
//         for (var W in Workouts2.Templates) {
//             for (var D in Workouts2.Templates[W]) {
//                 // console.log("Group 2 Template: ", W, D);
//                 var thisPatterns = Workouts2.Templates[W][D].Patterns; 
//                 // console.log(thisPatterns);
//                 CreateWorkoutTemplate(2, W, D, 0, AllWorkouts[2]);
//                 for (var K in thisPatterns) {
//                     if (thisPatterns[K].SplitSets) {
//                         // console.log(thisPatterns[K].Reps);
//                     }            
//                 }
//                 // typeof
//             }
//     }
// })
// // Creating Group 3 Workouts
// var N3a = 0;
// DestroyTemplates(3, 1).then(() => {
//     for (var W in Workouts3a.Templates) {
//         for (var D in Workouts3a.Templates[W]) {
//             // console.log("3a Template: ", Workouts3a.Templates[W][D]);
//             CreateWorkoutTemplate(3, W, D, 1, Workouts3a);
//             N3a ++;
//         }
//     }
//     console.log("N3a", N3a);
// })

// var N3b = 0;
// DestroyTemplates(3, 2).then(() => {
//     for (var W in Workouts3b.Templates) {
//         for (var D in Workouts3b.Templates[W]) {
//             // console.log("3b Template: ", Workouts3b.Templates[W][D]);
//             CreateWorkoutTemplate(3, W, D, 2, Workouts3b);
//             N3b ++;
//         }
//     }
//     console.log("N3b", N3b);
// })

// var N4a = 0;
// DestroyTemplates(4, 1).then(() => {
//     for (var W in Workouts4a.Templates) {
//         for (var D in Workouts4a.Templates[W]) {
//             // console.log("4a Template: ", Workouts4a.Templates[W][D]);
//             CreateWorkoutTemplate(4, W, D, 1, Workouts4a);
//             N4a ++;
//         }
//     }
//     console.log("N4a", N4a);
// })

var N4b = 0;
// DestroyTemplates(4, 2).then(() => {
//     for (var W in Workouts4b.Templates) {
//         for (var D in Workouts4b.Templates[W]) {
//             // console.log("4b Template: ", Workouts4b.Templates[W][D]);
//             CreateWorkoutTemplate(4, W, D, 2, Workouts4b);
//             N4b ++;
//         }
//     }
//     console.log("N4b", N4b);
// })

 
function CreateWorkoutTemplate(levelGroup, week, day, blockNum, JSONTemplates) {
    var WorkoutBlock = JSONTemplates;
    var thisTemplate = WorkoutBlock.Templates[week][day];
    var thisPatterns = thisTemplate.Patterns;
    var thisID = thisTemplate.ID;
    // return thisPatterns;
    // if (levelGroup == 3) {
        // console.log("Creating Template: " + blockNum, week, day);
    // }
    WorkoutTemplate.findOrCreate(
       {
        where: {
            levelGroup: levelGroup,
            week: week,
            day: day,
            block: blockNum
        }
    }).spread((template, created) => {
        template.save();
        // if (levelGroup == 3) {
        // console.log("Template Created: ", template.week, template.day, created);
        // }
        if (created) {
            if (template.levelGroup == 2) {
                // console.log("2 Created: " + template.week, template.day, template.levelGroup);
            }
            template.save();
        }
        else {
            if (template.levelGroup == 2) {
                // console.log("2 exists: " + template.week, template.day, template.levelGroup);
            }
            // template.save();            
            template.number = thisID;
            template.NSubworkouts = 0;
            // console.log(template.week, template.day);
            for (var K in thisPatterns) {
                var ID = K; 
                SubWorkoutTemplate.findOrCreate({
                    where: {
                        number: ID, 
                        fk_workout: template.id, 
                    }
                }).spread((result, created) => {
                    // return
                    // console.log("line 94", template.week, template.day);
                    template.NSubworkouts ++;
                    var Key = result.number;
                    var thisSub = thisPatterns[Key];
                    setPatternInfo(thisSub,result);
                    template.save();
                    // console.log("149");
                });            
            }
            template.save();
        }
    })        
}

function setPatternInfo(PatternJSON, SubTemplate) {
    SubTemplate.exerciseType = PatternJSON.ExerciseType.trim();
    SubTemplate.sets = PatternJSON.Sets;        
    // Split Set Handling
    // REP
    if (Array.isArray(PatternJSON.Reps)) {
        SubTemplate.repsList = PatternJSON.Reps;
        SubTemplate.RPEList = PatternJSON.RPE;                
        // console.log("RPE: " + PatternJSON.RPE);         
    }
    else { //Not Split Set
        SubTemplate.reps = PatternJSON.Reps;
        // console.log(PatternJSON.Reps, PatternJSON.number);
        // Type Enums: ['normal', 'bodyweight', 'carry', 'stop', 'drop', 'deload', 'alloy'],
        if (typeof PatternJSON.Reps == typeof "string") {
            // SubTemplate.reps = parseInt(PatternJSON.Reps);
            // console.log("string reps: " + PatternJSON.Reps);
            if (PatternJSON.Reps.includes("Seconds")) {
                SubTemplate.reps = parseInt(PatternJSON.Reps.split(" ")[0]);
            }
            else if (PatternJSON.Reps == "Bodyweight" || PatternJSON.Reps == "#") {
                SubTemplate.reps = null;
                SubTemplate.type = "bodyweight";                
            }
        }
        // Range RPE Handling
        if (typeof PatternJSON.RPE == typeof "string") {
            var Split = PatternJSON.RPE.split("-");
            var RPE1 = parseFloat(Split[0]);
            var RPE2 = parseFloat(Split[1]);
            SubTemplate.RPERange = [RPE1, RPE2];
        }
        else {
            SubTemplate.RPE = PatternJSON.RPE;
            // SubTemplate.RPE = 3.0;
        }
    }                    
    // Special Set Handling
    if (PatternJSON.Type) {
        SubTemplate.type = PatternJSON.Type.toLowerCase();                                
    }
    if (PatternJSON.Alloy) {
        SubTemplate.alloy = PatternJSON.Alloy;
        SubTemplate.alloyreps = PatternJSON.AlloyReps;
        SubTemplate.type = 'alloy';
    } 
    else if (PatternJSON.deload) {
        SubTemplate.type = 'deload';
        SubTemplate.deload = PatternJSON.Deload;
    }
    // Stop & Drop Sets
    if (SubTemplate.type == 'stop') {
        SubTemplate.specialValue = PatternJSON.StopRPE;
    }
    else if (SubTemplate.type == 'drop') {
        SubTemplate.specialValue = PatternJSON.DropValue; 
    }  
    //Carry   
    if (PatternJSON.Seconds 
        || PatternJSON.ExerciseType == "Carry"
        || SubTemplate.exerciseType == "Carry") {
        SubTemplate.type = 'carry';
        if (!PatternJSON.Reps) {
            SubTemplate.reps = PatternJSON.Seconds;
        }
        else {
            SubTemplate.reps = PatternJSON.Reps;
        }
    }
    // SubTemplate.reps = 30;
    // Setting Description
    SubTemplate.description = SubTemplate.exerciseType + " " + SubTemplate.sets 
    + " x " + SubTemplate.reps + " RPE: " + SubTemplate.RPE + " Alloy: " + SubTemplate.alloy 
    + " Deload: " + SubTemplate.deload + " Type: " + SubTemplate.type;
    SubTemplate.save();
    // console.log("typeof Decimal: ", typeof SubTemplate.RPE);
    // console.log("line 100 GT");
    // template.save();
}
