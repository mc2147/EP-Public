const {CreateUser, SetUser} = require('../models/createUser');
const {WorkoutTemplate, SubWorkoutTemplate, User, Video} = require('../models/index');

async function modifyUsers() {
    let craigUser = await User.findOne({
        where:{
            username:'c_lloy@hotmail.com'
        }
    });
    craigUser.workouts[1].Completed = true;
    craigUser.workouts[2].Completed = true;
    craigUser.changed('workouts', true);
    await craigUser.save();
    // for (var W in craigUser.workouts) {

    // }

    // let benjamin = await User.findOne({
    //     where:{
    //         username:'benjamin_chia1998@hotmail.com'
    //     }
    // });
    // benjamin.workouts = {};
    // benjamin.workoutDates = [];
    // benjamin.initialized = false;
    // benjamin.level = 6;
    // benjamin.blockNum = 0;
    // benjamin.levelGroup = 2;
    // benjamin.resetStats = true;
    // await benjamin.save();
}

modifyUsers()
  .catch(err => {
    console.log("error!!!");
    console.error(err.message)
    console.error(err.stack)
    process.exitCode = 1
  })
  .then(() => {
    console.log('finished modifying users!!!')
    process.exitCode = 0;
  })
