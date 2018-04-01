const Sequelize = require('sequelize');

const db = new Sequelize('postgres://localhost:5432/AS_db', {
    logging: false,
    dialectOptions: { decimalNumbers: true }
});

const Exercise = db.define('Exercise', {
    type: {
        type: Sequelize.STRING
    },
    name: {
        type: Sequelize.STRING,
        allowNull: true,
    },
    level: {
        type: Sequelize.INTEGER
    },
    bodyweight: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
    }
});

const Video = db.define('Video', {
    title: {
        type: Sequelize.STRING
    },
    url: {
        type: Sequelize.STRING
    },
    levelAccess: {
        type: Sequelize.INTEGER 
    }

})

var WorkoutTemplate = db.define('WorkoutTemplate', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement:true,
    },
    number: {
        type: Sequelize.INTEGER,
    },
    levelGroup: {
        type: Sequelize.INTEGER
    },
    block: {
        type: Sequelize.INTEGER
    },
    week: {
        type: Sequelize.INTEGER
    },
    day: {
        type: Sequelize.INTEGER
    },
    NSubworkouts: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
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
    specialValue: {
        type: Sequelize.DECIMAL,
        allowNull: true,
    },
    sets: {
        type: Sequelize.INTEGER,        
        allowNull: true,
    },
    // Normal Reps and RPE
    reps: {
        type: Sequelize.INTEGER,        
        allowNull: true,
    },
    RPE: {
        type: Sequelize.DECIMAL,        
        allowNull: true,
    },
    // Split Cases (Reps and RPE)
    repsList: {
        type: Sequelize.ARRAY(Sequelize.DECIMAL),
        defaultValue: [],
        allowNull: true,
    },
    RPEList: {
        type: Sequelize.ARRAY(Sequelize.DECIMAL),
        defaultValue: [],
        allowNull: true,
    },
    // Range Cases (RPEs)
    RPERange: {
        type: Sequelize.RANGE(Sequelize.DECIMAL),
        defaultValue: [],
        allowNull: true,
    },
    // Alloy and Special
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

const User = db.define('User', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },  
    level: {
        type: Sequelize.INTEGER,
    },  
    blockNum: {
        type: Sequelize.INTEGER,
    },      
    stats: {
        type: Sequelize.JSON, 
    },
    levelGroup: {
        type: Sequelize.INTEGER
    },
    workouts: {
        type: Sequelize.JSON,  
        //ID'd by workout # (per L Group, Block)
        //Can have a "current" value to quickly get current workout
        //Missing workout case:
            //Shift workoutDates by 1 after current(?)
            //Reassign (completed) to all
    },
    currentWorkoutID: {
        type: Sequelize.INTEGER,
    },
    currentWorkout: {
        type: Sequelize.JSON,  
    },
    workoutDates: {
        type: Sequelize.ARRAY(Sequelize.DATE),
        //Same dates as with workouts, ID'd by workout # (per L Group, Block)
        //For easy indexing with workouts, finding closest date, etc.
    },
    // currentWorkoutID: {
    //     type: Sequelize.INTEGER,
    //     //To easily find current/next workout
    // },
    startDate: {
        type: Sequelize.DATE,
    },
    signUpDate: {
        type: Sequelize.DATE,
    }
    // thisPatterns: [],
});



SubWorkoutTemplate.belongsTo(WorkoutTemplate, {foreignKey: 'fk_workout', foreignKeyConstraint:true });
WorkoutTemplate.hasMany(SubWorkoutTemplate, {foreignKey: 'fk_workout', as: 'subWorkouts'});
 
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

// db.sync({force: true});
// db.sync();

module.exports = {
    db: db,
    Exercise: Exercise,
    WorkoutTemplate,
    Workout,
    User,
    SubWorkoutTemplate,
};