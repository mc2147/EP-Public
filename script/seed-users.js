// const models = require('../models');
console.log("seeding users");
// const createUsers = require('../models/createUser');
const {CreateUser, SetUser} = require('../models/createUser');
const {WorkoutTemplate, SubWorkoutTemplate, User, Video} = require('../models/index');

var DayValue = 24*3600*1000;
var oldDate = new Date(Date.now() - 10*DayValue);
var thisDate = new Date(Date.now());         

let testUsernames = [
  'UserName1', 'UserName2', "UserName3", "UserName4", 'UserName5', 'UserName6',
  'AdminBryce', 'AdminSterner', 'AdminChan', 'AdminSitwala', 'mc2147', 'BetaSitwala',
  'ABradley', 'ASterczala', 'ACalderone',
  'DemoBeta'];

async function generateUsers() {
    for (var i = 0; i < testUsernames.length; i++) {
      let _username = testUsernames[i];
      await User.destroy({where:{
        username:_username
      }});
    }
    // await User.destroy({where:{}});
    console.log('existing users destroyed');
    await CreateUser("UserName1", 1, 0, 1, thisDate, [1, 3, 5], true);
    await CreateUser("UserName2", 2, 0, 6, thisDate, [1, 2, 3, 5], true);
    await CreateUser("UserName3", 3, 1, 11, thisDate, [1, 2, 3, 5], true);
    await CreateUser("UserName4", 4, 1, 16, thisDate, [1, 2, 3, 5], true);
    await CreateUser("UserName5", 3, 2, 12, oldDate, [1, 2, 3, 5], true);
    await CreateUser("UserName6", 4, 2, 16, thisDate, [1, 2, 3, 5], true);
    // Alex Admins
    await CreateUser("AdminBryce", 3, 1, 11, thisDate, [1, 2, 3, 5], true, "ABryce274", true, false);
    await CreateUser("AdminSterner", 3, 1, 11, thisDate, [1, 2, 3, 5], true, "ASterner368", true, false);
    // Amy & Matt Admins
    await CreateUser("AdminChan", 3, 1, 11, thisDate, [1, 2, 3, 5], true, "AChan2147", true, true);
    await CreateUser("AdminSitwala", 3, 1, 11, thisDate, [1, 2, 3, 5], true, "ASitwala9", true, true);
    // Amy & Matt beta accounts
    await CreateUser("mc2147", 3, 1, 11, thisDate, [1, 2, 3, 5], false, "AChan2147", true, false);
    await CreateUser("BetaSitwala", 3, 1, 11, thisDate, [1, 2, 3, 5], false, "BSitwala9", true, false);
    
    // CREATING NON-ADMIN BETA TESTERS
    // CreateUser("BetaUser", 2, 0, 6, date, [Day 1, Day 2...], false -> (admin), "Password", false -> (filledStats), false -> defaultWorkouts);
    await CreateUser("ABradley", 2, 0, 6, "", [], false, "ABradley284", false, false);
    await CreateUser("ASterczala", 3, 1, 11, "", [], false, "ASterczala371", false, false);
    await CreateUser("ACalderone", 2, 0, 6, "", [], false, "ACalderone493", false, false);
    // Demo Users
    await CreateUser("DemoBeta", 3, 1, 11, "", [], false, "DemoBeta", false, false);        
    // console.log(test);
}

generateUsers()
  .catch(err => {
    console.log("error!!!");
    console.error(err.message)
    console.error(err.stack)
    process.exitCode = 1
  })
  .then(() => {
    console.log('finished seeding users')
    process.exitCode = 0;
  })

