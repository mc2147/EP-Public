import { getWorkoutDays } from "../../globals/functions";
import { AllWorkouts, ExerciseDict } from "../../data";
import { DaysofWeekDict } from "../../globals/enums";
import { User, Video } from "../../models";
import axios from "axios";
import bcrypt from "bcryptjs";
var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const saltRounds = 10;

function generateSalt() {
  return bcrypt.genSaltSync(saltRounds);
}

export function generateHash(password, salt) {
  return bcrypt.hashSync(password, salt, null);
}

export async function signupUser(input) {
  var P1 = input.P1;
  var P2 = input.P2;
  var username = input.username;
  let name = input.name;
  let existingUser = await User.find({
    where: {
      username
    }
  });
  let userExists = false;
  if (existingUser) {
    userExists = true;
  }
  var salt = generateSalt();
  if (P1 == P2) {
    var hashedPassword = generateHash(P1, salt);
    if (!userExists) {
      var newUser = await User.create({
        username: username,
        name,
        salt: salt,
        password: hashedPassword
      });
      if (newUser) {
        return {
          userExists,
          newUser,
          session: {
            userId: newUser.id,
            username: username,
            User: newUser
          }
        };
      }
    } else {
      return {
        userExists,
        error: true,
        status: "error"
      };
    }
  } else {
    return false;
  }
}

export async function assignLevel(_User, input) {
  let { squatWeight, benchWeight, RPEExp, bodyWeight } = input;
  if (squatWeight < bodyWeight) {
    _User.level = 1;
  } else if (
    squatWeight > bodyWeight * 1.5 &&
    benchWeight > bodyWeight &&
    RPEExp
  ) {
    _User.level = 11;
    _User.blockNum = 1;
  } else {
    _User.level = 6;
  }
  await _User.save();
}

export async function accessInfo(user, timezoneOffset = 0) {
  let TZOffset = parseInt(user.TZOffset);

  let response = Object.assign({}, user);
  let Now = new Date(Date.now() - TZOffset * 1000 * 60 * 60);
  // Workouts
  let hasLevel = true; //send to enter stats page
  let initialized = user.initialized;
  let hasWorkouts = false; //level-up get-next-workouts or get-initial-workouts
  let missedWorkouts = false; //reschedule workouts prompt
  // Stipe & Subscription
  let hasStripe = false;
  let hadSubscription = false;
  let subscriptionValid = false;
  let subscriptionExpired = false;
  // let initialized = false;
  let subscriptionStatus = null;
  let accessLevel = 0;
  let planID = "";
  let subscriptionsList = [];
  //
  console.log("user access info for: ", user.username);

  if (user.stripeId != "") {
    try {
      let stripeUser = await stripe.customers.retrieve(user.stripeId);
      subscriptionsList = stripeUser.subscriptions.data;
      if (stripeUser.description == "Subscribed Once") {
        hadSubscription = true;
      }
      if (stripeUser.subscriptions.data.length > 0) {
        let currentSubscription = stripeUser.subscriptions.data[0];
        let currentSubID = currentSubscription.id;
        let currentPlan = currentSubscription.plan;
        hadSubscription = true;
        subscriptionStatus = stripeUser.subscriptions.data[0].status;
        //Subscription Trial Case
        planID = currentPlan.id;
        //Trial-only plan and past trial period
        if (currentPlan.id == "AS_Trial" && subscriptionStatus != "trialing") {
          subscriptionExpired = true;
          await stripe.subscriptions.del(currentSubID);
          console.log("cancelling trial subscription");
          //Cancel subscription here
        }
        //Normal Plan Case
        //Normal plan and trial or active, not past_due
        else if (
          subscriptionStatus == "trialing" ||
          subscriptionStatus == "active"
        ) {
          subscriptionValid = true;
        } else {
          subscriptionExpired = true;
        }
      }
      hasStripe = true;
    } catch (error) {
      console.log("access info error (line 145): ", error);
      hasStripe = false;
    }
  }

  if (!user.level || user.level == 0 || user.level == null) {
    hasLevel = false;
  }
  if (user.stats["Level Up"] && !user.stats["Level Up"].Checked) {
    hasWorkouts = true;
  }

  for (var K in user.workouts) {
    let W = user.workouts[K];
    let wDate = new Date(W.Date);
    console.log("wDate: ", wDate);
    //Get date to string here
    if (
      //If there's an incomplete workout before the current date
      !W.Completed &&
      wDate
    ) {
      // Smaller year
      if (wDate.getYear() < Now.getYear()) {
        missedWorkouts = true;
        break;
      }
      // Same year, smaller month
      else if (
        wDate.getYear() == Now.getYear() &&
        wDate.getMonth() < Now.getMonth()
      ) {
        missedWorkouts = true;
        break;
      }
      // Same year, same month, smaller date
      else if (
        wDate.getYear() == Now.getYear() &&
        wDate.getMonth() == Now.getMonth() &&
        wDate.getDate() < Now.getDate()
      ) {
        missedWorkouts = true;
        break;
      }
    }
  }
  let output = {
    // Stripe & Subcriptions
    hasStripe,
    hadSubscription,
    subscriptionValid,
    subscriptionStatus,
    subscriptionExpired,
    // Workouts
    hasLevel,
    hasWorkouts,
    missedWorkouts,
    initialized
  };

  if (hadSubscription) {
    accessLevel = 1;
  }
  if (hadSubscription && hasLevel) {
    accessLevel = 2;
  }
  if (hadSubscription && hasLevel && initialized) {
    accessLevel = 3;
  }
  if (hadSubscription && hasLevel && initialized && subscriptionValid) {
    accessLevel = 4;
  }
  if (
    hadSubscription &&
    hasLevel &&
    initialized &&
    subscriptionValid &&
    hasWorkouts
  ) {
    accessLevel = 5;
  }
  if (
    hadSubscription &&
    hasLevel &&
    initialized &&
    subscriptionValid &&
    hasWorkouts &&
    !missedWorkouts
  ) {
    accessLevel = 6;
  }
  let nonAdminAccess = accessLevel;
  if (user.isAdmin) {
    accessLevel = 6;
  }
  console.log("accessLevel (accessInfo): ", accessLevel);
  console.log("subscriptions list: ", subscriptionsList);
  return {
    // Stripe & Subcriptions
    hasStripe,
    hadSubscription,
    subscriptionValid,
    subscriptionStatus,
    subscriptionExpired,
    planID,
    // Workouts
    hasLevel,
    hasWorkouts,
    missedWorkouts,
    // Access Level
    accessLevel,
    nonAdminAccess
  };
}
