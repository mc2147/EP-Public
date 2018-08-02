"use strict";

// const models = require('../models');
console.log("DESTROYING users");
// const createUsers = require('../models/createUser');
// const {CreateUser, SetUser} = require('../models/createUser');

var _require = require('../models/index'),
    WorkoutTemplate = _require.WorkoutTemplate,
    SubWorkoutTemplate = _require.SubWorkoutTemplate,
    User = _require.User,
    Video = _require.Video;

var DayValue = 24 * 3600 * 1000;
var oldDate = new Date(Date.now() - 10 * DayValue);
var thisDate = new Date(Date.now());

// let testUsernames = [
//   'UserName1', 'UserName2', "UserName3", "UserName4", 'UserName5', 'UserName6',
//   'AdminUser',
//   'AdminBryce', 'AdminSterner', 'AdminChan', 'AdminSitwala', 'mc2147', 'BetaSitwala',
//   'ABradley', 'ASterczala', 'ACalderone',
//   'DemoBeta'];

async function destroyUsers() {
  await User.destroy({ where: {} });
  console.log("ALL USERS DESTROYED!!");
}

destroyUsers().catch(function (err) {
  console.log("error!!!");
  console.error(err.message);
  console.error(err.stack);
  process.exitCode = 1;
}).then(function () {
  console.log('finished destroying users');
  process.exitCode = 0;
});