const Sequelize = require('sequelize');
var data = require('../data');
var models = require('./index');
var WorkoutTemplate = models.WorkoutTemplate;
var SubWorkoutTemplate = models.SubWorkoutTemplate;

// var globals = require('../globals');
// var globalFuncs = require('../globalFunctions');
var AllWorkouts = data.AllWorkouts;

// console.log("GENERATING TEMPLATES");

var Workouts1 = data.Workouts1;
// console.log(AllWorkouts);

// console.log("\nCreate Workout Template:");
// console.log(CreateWorkoutTemplate(1, 3, 2, 0));

// Creating Group 1 Workouts
for (var W in Workouts1.Templates) {
    for (var D in Workouts1.Templates[W]) {
        // console.log("W, D: ", W, D);
        CreateWorkoutTemplate(1, W, D, 0);
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
        }
        else {
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
                var Description = ExerciseName + " " + Sets + " " + Reps + " RPE: " + RPE + " Alloy: " + Alloy + " Deload: " + Deload;

                SubWorkoutTemplate.findOrCreate({
                    where: {
                        number: ID, 
                        fk_workout: template.id, 
                    }
                }).spread((result, created) => {
                    var Key = result.number;
                    var thisSub = thisPatterns[Key];
                    
                    result.exerciseType = thisSub.ExerciseType;
                    result.sets = thisSub.Sets;
                    // Test Code
                    // result.sets = 3;
                    result.reps = thisSub.Reps;
                    result.RPE = thisSub.RPE;
                    
                    if (thisSub.deload) {
                        result.type = 'deload';
                        result.deload = thisSub.Deload;
                    }
                    else if (thisSub.Alloy) {
                        result.alloy = thisSub.Alloy;
                        result.alloyreps = thisSub.AlloyReps;
                        result.type = 'alloy';
                        console.log("87");
                    } 
                    if (thisSub.Type) {
                        result.type = thisSub.Type;                        
                    }
                    if (result.type == 'stop') {
                        result.specialValue = thisSub.StopRPE;
                    }
                    else if (result.type == 'drop') {
                        result.specialValue = thisSub.DropValue; 
                    }
                    console.log("result.type: ", result.type, template.week, template.day);
                    console.log(thisSub);
                    // console.log("subWorkout Type: " + result.type);
                    result.description = result.exerciseType + " " + result.sets 
                    + " x " + result.reps + " RPE: " + result.RPE + " Alloy: " + result.alloy 
                    + " Deload: " + result.deload + " Type: " + result.type;
                    // console.log("Subworkout: " + result.number + " workout: " + result.fk_workout + " " + result.exerciseType);
                    // console.log("   Description: " + result.description);
                    result.save();
                    template.save();
                });            
            }
        }
    })        
}

