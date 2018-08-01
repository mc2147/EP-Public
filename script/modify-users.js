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
    let wDates = craigUser.workoutDates;
    let newDates = wDates.slice(0, -1);
    let newFirstDateNum = wDates[0].getDate() - 3;
    let newFirstDateObj = new Date(wDates[0]);
    console.log('newFirstDateObj: ', newFirstDateObj);
    
    newFirstDateObj.setDate(newFirstDateNum);
    newDates.unshift(newFirstDateObj);
    console.log('calculating new dates: ', newDates);
    craigUser.workoutDates = newDates;
    for (let i = 0; i < newDates.length; i ++) {
        let workoutIndex = i + 1;
        console.log('   workoutIndex: ', workoutIndex, ' completed: ', craigUser.workouts[workoutIndex].Completed);
        console.log('   new date: ', newDates[i]);
        craigUser.workouts[workoutIndex].Date = newDates[i];
    }
    // for (var W in craigUser.workouts) {

    // }
    craigUser.changed('workoutDates', true);
    craigUser.changed('workouts', true);
    await craigUser.save();

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
