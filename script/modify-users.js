const { CreateUser, SetUser } = require("../models/createUser");
const {
  WorkoutTemplate,
  SubWorkoutTemplate,
  User,
  Video
} = require("../models/index");

async function modifyUsers() {
  let sabirUser = await User.findOne({
    where: {
      username: "sabirg13@gmail.com"
    }
  });
  for (var W in sabirUser.workouts) {
    if (W <= 12) {
      sabirUser.workouts[W].Completed = true;
    }
  }
  sabirUser.changed("workouts", true);
  await sabirUser.save();
}

modifyUsers()
  .catch(err => {
    console.log("error!!!");
    console.error(err.message);
    console.error(err.stack);
    process.exitCode = 1;
  })
  .then(() => {
    console.log("finished modifying users!!!");
    process.exitCode = 0;
  });
