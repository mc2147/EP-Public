'use strict';

var _require = require('../models/createUser'),
    CreateUser = _require.CreateUser,
    SetUser = _require.SetUser;

var _require2 = require('../models/index'),
    WorkoutTemplate = _require2.WorkoutTemplate,
    SubWorkoutTemplate = _require2.SubWorkoutTemplate,
    User = _require2.User,
    Video = _require2.Video;

async function modifyUsers() {
    var craigUser = await User.findOne({
        where: {
            username: 'c_lloy@hotmail.com'
        }
    });
    craigUser.workouts[1].Completed = true;
    craigUser.workouts[2].Completed = true;
    var wDates = craigUser.workoutDates;
    var newDates = wDates.slice(0, -1);
    var newFirstDateNum = wDates[0].getDate() - 3;
    var newFirstDateObj = new Date(wDates[0]);
    console.log('newFirstDateObj: ', newFirstDateObj);

    newFirstDateObj.setDate(newFirstDateNum);
    newDates.unshift(newFirstDateObj);
    console.log('calculating new dates: ', newDates);
    craigUser.workoutDates = newDates;
    for (var i = 0; i < newDates.length; i++) {
        var workoutIndex = i + 1;
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

modifyUsers().catch(function (err) {
    console.log("error!!!");
    console.error(err.message);
    console.error(err.stack);
    process.exitCode = 1;
}).then(function () {
    console.log('finished modifying users!!!');
    process.exitCode = 0;
});