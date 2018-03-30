const Sequelize = require('sequelize');
var data = require('../data');
var models = require('./index');
var WorkoutTemplate = models.WorkoutTemplate;
var SubWorkoutTemplate = models.SubWorkoutTemplate;

var AllWorkouts = data.AllWorkouts;

var Workouts1 = data.Workouts1;
var Workouts2 = data.Workouts2;
// var Workouts3a = require("../dat")

// Creating Group 1 Workouts
for (var W in Workouts1.Templates) {
    for (var D in Workouts1.Templates[W]) {
        CreateWorkoutTemplate(1, W, D, 0);
    }
}

// Creating Group 2 Workouts
// WorkoutTemplate.destroy({
//     where: {
//         levelGroup: 2
//     },
// })

for (var W in Workouts2.Templates) {
    for (var D in Workouts2.Templates[W]) {
        // console.log("Group 2 Template: ", W, D);
        var thisPatterns = Workouts2.Templates[W][D].Patterns; 
        // console.log(thisPatterns);
        CreateWorkoutTemplate(2, W, D, 0);
        for (var K in thisPatterns) {
            if (thisPatterns[K].SplitSets) {
                // console.log(thisPatterns[K].Reps);
            }            
        }
        // typeof
    }
}


function CreateWorkoutTemplate(levelGroup, week, day, blockNum) {
    var WorkoutBlock = AllWorkouts[levelGroup];
    if (levelGroup >= 3) {
        WorkoutBlock = WorkoutBlock[blockNum];
    }

    var thisTemplate = WorkoutBlock.Templates[week][day];
    var thisPatterns = thisTemplate.Patterns;
    var thisID = thisTemplate.ID;

    // return thisPatterns;

    WorkoutTemplate.findOrCreate(
       {
        where: {
            levelGroup: levelGroup,
            week: week,
            day: day,
            block: blockNum
        }
    }).spread((template, created) => {
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
            for (var K in thisPatterns) {
                var Sub = thisPatterns[K];
                var ID = K; //ID is key (1-6)
                var ExerciseName = Sub.ExerciseType;
                var Sets = Sub.Sets;
                var Reps = Sub.Reps;
                var RPE = Sub.RPE;
                var Deload = Sub.Deload;
                var Alloy = Sub.Alloy;
                var Description = ExerciseName + " " + Sets + " " + Reps + " RPE: " 
                + RPE + " Alloy: " + Alloy + " Deload: " + Deload;

                SubWorkoutTemplate.findOrCreate({
                    where: {
                        number: ID, 
                        fk_workout: template.id, 
                    }
                }).spread((result, created) => {
                    // return
                    // console.log("line 94", template.week, template.day);
                    var Key = result.number;
                    var thisSub = thisPatterns[Key];
                    result.exerciseType = thisSub.ExerciseType;
                    result.sets = thisSub.Sets;
                    // Split Set Handling
                    if (Array.isArray(thisSub.RPE)) {
                        // console.log("RPE", thisSub.RPE);
                        // console.log("Reps", thisSub.Reps);
                        result.repsList = thisSub.Reps;
                        result.RPEList = thisSub.RPE;                         
                        // result.RPE = null;
                        // result.reps = null;                   
                    }
                    else { //Not Split Set
                        result.reps = thisSub.Reps;
                        // Range RPE Handling
                        if (typeof thisSub.RPE == typeof "string") {
                            var Split = thisSub.RPE.split("-");
                            var RPE1 = parseFloat(Split[0]);
                            var RPE2 = parseFloat(Split[1]);
                            result.RPERange = [RPE1, RPE2];
                        }
                        else {
                            result.RPE = thisSub.RPE;
                        }
                    }                    
                    // console.log("121: " + created);
                    // Special Set Handling
                    if (thisSub.Type) {
                        result.type = thisSub.Type;                        
                    }
                    if (thisSub.Alloy) {
                        result.alloy = thisSub.Alloy;
                        result.alloyreps = thisSub.AlloyReps;
                        result.type = 'alloy';
                    } 
                    else if (thisSub.deload) {
                        result.type = 'deload';
                        result.deload = thisSub.Deload;
                    }
                    // Stop & Drop Sets
                    if (result.type == 'stop') {
                        result.specialValue = thisSub.StopRPE;
                    }
                    else if (result.type == 'drop') {
                        result.specialValue = thisSub.DropValue; 
                    }  
                    //Carry   
                    if (thisSub.Seconds) {
                        result.reps = thisSub.Seconds;
                        result.type = 'carry';
                    }
                    // Setting Description
                    result.description = result.exerciseType + " " + result.sets 
                    + " x " + result.reps + " RPE: " + result.RPE + " Alloy: " + result.alloy 
                    + " Deload: " + result.deload + " Type: " + result.type;
                    // console.log("146");
                    result.save();
                    template.save();
                    // console.log("149");
                });            
            }
        }
    })        
}

