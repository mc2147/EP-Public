'use strict';

// const models = require('../models');
console.log("seeding users");
// const createUsers = require('../models/createUser');

var _require = require('../models/createUser'),
    CreateUser = _require.CreateUser,
    SetUser = _require.SetUser;

var _require2 = require('../models/index'),
    WorkoutTemplate = _require2.WorkoutTemplate,
    SubWorkoutTemplate = _require2.SubWorkoutTemplate,
    User = _require2.User,
    Video = _require2.Video;

var DayValue = 24 * 3600 * 1000;
var oldDate = new Date(Date.now() - 10 * DayValue);
var thisDate = new Date(Date.now());

var testUsernames = ['UserName1', 'UserName2', "UserName3", "UserName4", 'UserName5', 'UserName6', 'AdminUser', 'AdminBryce', 'AdminSterner', 'AdminChan', 'AdminSitwala', 'mc2147', 'BetaSitwala', 'ABradley', 'ASterczala', 'ACalderone', 'DemoBeta'];

async function generateUsers() {
  for (var i = 0; i < testUsernames.length; i++) {
    var _username = testUsernames[i];
    await User.destroy({ where: {
        username: _username
      } });
    console.log('destroying test user: ', _username);
  }
  // await User.destroy({where:{}});
  console.log('test users destroyed');
  // return;
  await CreateUser("UserName1", 1, 0, 1, thisDate, [1, 3, 5], true);
  await CreateUser("UserName2", 2, 0, 6, thisDate, [1, 2, 3, 5], true);
  await CreateUser("UserName3", 3, 1, 11, thisDate, [1, 2, 3, 5], true);
  await CreateUser("UserName4", 4, 1, 16, thisDate, [1, 2, 3, 5], true);
  await CreateUser("UserName5", 3, 2, 12, oldDate, [1, 2, 3, 5], true);
  await CreateUser("UserName6", 4, 2, 16, thisDate, [1, 2, 3, 5], true);
  // Generic Admin
  await CreateUser("AdminUser", 3, 1, 11, thisDate, [1, 2, 3, 5], true, "Admin183", true, false, "Admin User");
  // Alex Admins
  await CreateUser("AdminBryce", 3, 1, 11, thisDate, [1, 2, 3, 5], true, "ABryce274", true, false, "Alex Bryce");
  await CreateUser("AdminSterner", 3, 1, 11, thisDate, [1, 2, 3, 5], true, "ASterner368", true, false, "Alex Sterner");
  // Amy & Matt Admins
  await CreateUser("AdminChan", 3, 1, 11, thisDate, [1, 2, 3, 5], true, "AChan2147", true, true, "Admin Chan");
  await CreateUser("AdminSitwala", 3, 1, 11, thisDate, [1, 2, 3, 5], true, "ASitwala9", true, true, "Admin Sitwala");
  // Amy & Matt beta accounts
  await CreateUser("mc2147", 3, 1, 11, thisDate, [1, 2, 3, 5], false, "AChan2147", true, false, "Matthew Chan");
  await CreateUser("BetaSitwala", 3, 1, 11, thisDate, [1, 2, 3, 5], false, "BSitwala9", true, false, "Amy Sitwala");

  // CREATING NON-ADMIN BETA TESTERS
  // CreateUser("BetaUser", 2, 0, 6, date, [Day 1, Day 2...], false -> (admin), "Password", false -> (filledStats), false -> defaultWorkouts);
  await CreateUser("ABradley", 2, 0, 6, "", [], false, "ABradley284", false, false, "Adam Bradley");
  await CreateUser("ASterczala", 3, 1, 11, "", [], false, "ASterczala371", false, false, "Adam Sterczala");
  await CreateUser("ACalderone", 2, 0, 6, "", [], false, "ACalderone493", false, false, "Adam Calderone");
  // Demo Users
  await CreateUser("DemoBeta", 3, 1, 11, "", [], false, "DemoBeta", false, false, "Demo Beta");
  // console.log(test);
}

generateUsers().catch(function (err) {
  console.log("error!!!");
  console.error(err.message);
  console.error(err.stack);
  process.exitCode = 1;
}).then(function () {
  console.log('finished seeding users');
  process.exitCode = 0;
});