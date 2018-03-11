const Sequelize = require('sequelize');
const db = new Sequelize('postgres://localhost:5432/AS_db', {
    logging: false
});
var globals = require('../globals')

Exercise_Types = ["UB Hor Push", "UB Vert Push", "UB Hor Pull",	"UB Vert Pull",	"Hinge", "Squat", "LB Uni Push", "Ant Chain", "Post Chain",
"Carry", "Iso 1", "Iso 2", "Iso 3", "Iso 4"];

console.log("globals.WorkoutSample: " + globals.WorkoutSample.SubWorkouts);

var SampleWorkout = globals.WorkoutSample;

console.log("models/index.js: ");
console.log(Exercise_Types);

const Exercise = db.define('Exercise', {
    name: {
        type: Sequelize.STRING
    },
    level: {
        type: Sequelize.INTEGER
    },
});

var WorkoutTemplate = db.define('WorkoutTemplate', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true,
    },
    levelGroup: {
        type: Sequelize.INTEGER
    },
    week: {
        type: Sequelize.INTEGER
    },
    day: {
        type: Sequelize.INTEGER
    },
    NSubworkouts: {
        type: Sequelize.INTEGER    	
    },
});

var SubWorkoutTemplate = db.define('SubWorkoutTemplate', {
	number: {  
        type: Sequelize.INTEGER,		
        // primaryKey: true,
        // autoIncrement:true,
	},
    exerciseType: {
        type: Sequelize.STRING,
        allowNull: true,
    },
	type: {
        type: Sequelize.ENUM,
        values: ['normal', 'bodyweight', 'carry', 'stop', 'drop', 'deload', 'alloy'],
        defaultValue: 'normal',
	},
    sets: {
        type: Sequelize.INTEGER,        
        allowNull: true,
    },
    reps: {
        type: Sequelize.INTEGER,        
        allowNull: true,
    },
    RPE: {
        type: Sequelize.INTEGER,        
        allowNull: true,
    },
    alloy: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: true,
    },
    alloyreps: {
        type: Sequelize.INTEGER,        
        allowNull: true,
    },
    deload: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        allowNull: true,
    },
    description: {
        type: Sequelize.STRING,
        defaultValue: "description",
    },
});

SubWorkoutTemplate.belongsTo(WorkoutTemplate, {foreignKey: 'fk_workout', foreignKeyConstraint:true });
WorkoutTemplate.hasMany(SubWorkoutTemplate, {foreignKey: 'fk_workout', as: 'subWorkouts'});

// WorkoutTemplate.hasMany(SubWorkoutTemplate);
// SubWorkoutTemplate.belongsTo(WorkoutTemplate);
// console.log(75);
// console.log(WorkoutTemplate);
// console.log(SubWorkoutTemplate);

// WorkoutTemplate.hasMany(SubWorkoutTemplate, {foreignKey: 'fk_workout', sourceKey: 'subWorkouts'});
// SubWorkoutTemplate.belongsTo(WorkoutTemplate, {foreignKey: 'fk_workout', targetKey: 'subWorkouts'});

// db.sync({force: true});
// db.sync();

WorkoutTemplate.findOrCreate(
   {
    where: {
        levelGroup: 1,
        week: 1,
        day: 1
    }
}).spread((template, created) => {
    if (created) {
        // console.log(template);        
    }
    else {
        console.log("Workout Template: " + template + " ID: " + template.id);
        console.log("LGroup: " + template.levelGroup + " Week: " + template.week + " Day: " + template.day + " # SubWorkouts: " + template.NSubworkouts);
        for (var K in SampleWorkout.SubWorkouts) {
            // console.log("ID: " + SampleWorkout.SubWorkouts[K].ID);
            var Sub = SampleWorkout.SubWorkouts[K];
            var ID = K;
            console.log("ExerciseName: " + ExerciseName);
            var ExerciseName = Sub.ExerciseType;
            var Sets = Sub.Sets;
            var Reps = Sub.Reps;
            var RPE = Sub.RPE;
            var Deload = Sub.Deload;
            var Alloy = Sub.Alloy;
            // console.log("K: " + K);
            var Description = ExerciseName + " " + Sets + " " + Reps + " RPE: " + RPE + " Alloy: " + Alloy + " Deload: " + Deload;
            SubWorkoutTemplate.findOrCreate({
                where: {
                    number: ID, 
                    fk_workout: template.id, 
                }
            }).spread((result, created) => {
                var Key = result.number;
                var SubSample = SampleWorkout.SubWorkouts[Key];
                result.exerciseType = SubSample.ExerciseType;
                result.sets = SubSample.Sets;
                result.reps = SubSample.Reps;
                result.RPE = SubSample.RPE;
                result.alloy = SubSample.Alloy;
                result.alloyreps = SubSample.AlloyReps;
                result.deload = SubSample.Deload;

                // result.sets = Sets;
                // result.reps = Reps;
                // result.RPE = RPE;
                // result.deload = Deload;
                // result.exerciseType = ExerciseName;
                if (result.deload) {
                    result.type = 'deload';
                    // console.log("deload set! 123");
                }
                if (result.alloy) {
                    result.type = 'alloy';
                } 
                result.description = result.exerciseType + " " + result.sets 
                + " x " + result.reps + " RPE: " + result.RPE + " Alloy: " + result.alloy 
                + " Deload: " + result.deload + " Type: " + result.type;
                // console.log("!result.deload 121: " + !result.deload);
                console.log("Subworkout: " + result.number + " workout: " + result.fk_workout + " " + result.exerciseType);
                console.log("   Description: " + result.description);
                result.save();
                template.save();
                // result.save();
            });            
            // console.log(K);
            // console.log(SampleWorkout.SubWorkouts[K])
        }        


        SubWorkoutTemplate.findAll({
            where: {
                fk_workout: template.id,
            }
        }).then(results => {
            // console.log(results);
            for (var i = 0; i < results.length; i++) {
                var Sub = results[i];
                // console.log(Sub.number + ", " + Sub.fk_workout + ", " + Sub.exerciseType);
            }

            // for (var E in results) {
            //     console.log("120: " + E);
            //     console.log(E.fk_workout);
            // }
            // console.log(results);
              // projects will be an array of Projects having the id 1, 2 or 3
              // this is actually doing an IN query
        })
    }
})


const Workout = db.define('Workout', {
	id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },	
    week: {
        type: Sequelize.INTEGER
    },
    day: {
        type: Sequelize.INTEGER
    },
});


// Workout.belongsTo(WorkoutTemplate);
// WorkoutTemplate.hasMany(Workout, {as: 'instances'});




const User = db.define('User', {
	stats: {
		type: Sequelize.JSON  
	},
});



module.exports = {
	db: db,
	Exercise: Exercise,
	WorkoutTemplate,
	Workout,
	User,
    SubWorkoutTemplate
};