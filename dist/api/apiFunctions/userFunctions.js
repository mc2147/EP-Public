"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateHash = generateHash;
exports.signupUser = signupUser;
exports.assignLevel = assignLevel;
exports.accessInfo = accessInfo;

var _functions = require("../../globals/functions");

var _data = require("../../data");

var _enums = require("../../globals/enums");

var _models = require("../../models");

var _axios = require("axios");

var _axios2 = _interopRequireDefault(_axios);

var _bcryptjs = require("bcryptjs");

var _bcryptjs2 = _interopRequireDefault(_bcryptjs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
var saltRounds = 10;

function generateSalt() {
  return _bcryptjs2.default.genSaltSync(saltRounds);
}

function generateHash(password, salt) {
  return _bcryptjs2.default.hashSync(password, salt, null);
}

async function signupUser(input) {
  var P1 = input.P1;
  var P2 = input.P2;
  var username = input.username;
  var name = input.name;
  var existingUser = await _models.User.find({
    where: {
      username: username
    }
  });
  var userExists = false;
  if (existingUser) {
    userExists = true;
    // return {
    //     userExists,
    // }
  }
  var salt = generateSalt();
  if (P1 == P2) {
    var hashedPassword = generateHash(P1, salt);
    if (!userExists) {
      var newUser = await _models.User.create({
        // id: 29,
        username: username,
        name: name,
        salt: salt,
        password: hashedPassword
      });
      if (newUser) {
        return {
          userExists: userExists,
          newUser: newUser,
          session: {
            userId: newUser.id,
            username: username,
            User: newUser
          }
        };
      }
    } else {
      return {
        userExists: userExists,
        error: true,
        status: "error"
      };
    }
  } else {
    return false;
  }
}

async function assignLevel(_User, input) {
  console.log("assigning level!!!");
  var squatWeight = input.squatWeight,
      benchWeight = input.benchWeight,
      RPEExp = input.RPEExp,
      bodyWeight = input.bodyWeight;

  if (squatWeight < bodyWeight) {
    _User.level = 1;
  } else if (squatWeight > bodyWeight * 1.5 && benchWeight > bodyWeight && RPEExp) {
    _User.level = 11;
    _User.blockNum = 1;
    console.log("level 11! blockNum: ", _User.blockNum);
  } else {
    _User.level = 6;
  }
  await _User.save();
}

async function accessInfo(user) {
  var timezoneOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

  var TZOffset = parseInt(user.TZOffset);
  console.log("TZOffset: ", TZOffset);
  var response = Object.assign({}, user);
  var Now = new Date(Date.now() - TZOffset * 1000 * 60 * 60);
  // Workouts
  var hasLevel = true; //send to enter stats page
  var initialized = user.initialized;
  var hasWorkouts = false; //level-up get-next-workouts or get-initial-workouts
  var missedWorkouts = false; //reschedule workouts prompt
  // Stipe & Subscription
  var hasStripe = false;
  var hadSubscription = false;
  var subscriptionValid = false;
  var subscriptionExpired = false;
  // let initialized = false;
  var subscriptionStatus = null;
  var accessLevel = 0;
  var planID = "";
  var subscriptionsList = [];
  //
  console.log("user access info for: ", user.username);
  // console.log("user (accessInfo): ", user);
  if (user.stripeId != "") {
    try {
      var stripeUser = await stripe.customers.retrieve(user.stripeId);
      subscriptionsList = stripeUser.subscriptions.data;
      if (stripeUser.description == "Subscribed Once") {
        hadSubscription = true;
      }
      if (stripeUser.subscriptions.data.length > 0) {
        var currentSubscription = stripeUser.subscriptions.data[0];
        var currentSubID = currentSubscription.id;
        var currentPlan = currentSubscription.plan;
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
        else if (subscriptionStatus == "trialing" || subscriptionStatus == "active") {
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
  // if (user.workoutDates.length > 0) {
  //     hasWorkouts = true;
  // }
  // if (user.workoutDates.length > 0 || user.oldworkouts.length > 0) {
  // initialized = true;
  // }
  // Checking for missed workouts
  console.log("Now: ", Now);
  for (var K in user.workouts) {
    var W = user.workouts[K];
    var wDate = new Date(W.Date);
    console.log("wDate: ", wDate);
    //Get date to string here
    if (
    //If there's an incomplete workout before the current date
    !W.Completed && wDate) {
      // Smaller year
      if (wDate.getYear() < Now.getYear()) {
        missedWorkouts = true;
        break;
      }
      // Same year, smaller month
      else if (wDate.getYear() == Now.getYear() && wDate.getMonth() < Now.getMonth()) {
          missedWorkouts = true;
          break;
        }
        // Same year, same month, smaller date
        else if (wDate.getYear() == Now.getYear() && wDate.getMonth() == Now.getMonth() && wDate.getDate() < Now.getDate()) {
            missedWorkouts = true;
            break;
          }
    }
  }
  var output = {
    // Stripe & Subcriptions
    hasStripe: hasStripe,
    hadSubscription: hadSubscription,
    subscriptionValid: subscriptionValid,
    subscriptionStatus: subscriptionStatus,
    subscriptionExpired: subscriptionExpired,
    // Workouts
    hasLevel: hasLevel,
    hasWorkouts: hasWorkouts,
    missedWorkouts: missedWorkouts,
    initialized: initialized
  };
  // console.log
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
  if (hadSubscription && hasLevel && initialized && subscriptionValid && hasWorkouts) {
    accessLevel = 5;
  }
  if (hadSubscription && hasLevel && initialized && subscriptionValid && hasWorkouts && !missedWorkouts) {
    accessLevel = 6;
  }
  var nonAdminAccess = accessLevel;
  if (user.isAdmin) {
    accessLevel = 6;
  }
  console.log("accessLevel (accessInfo): ", accessLevel);
  console.log("subscriptions list: ", subscriptionsList);
  return {
    // Stripe & Subcriptions
    hasStripe: hasStripe,
    hadSubscription: hadSubscription,
    subscriptionValid: subscriptionValid,
    subscriptionStatus: subscriptionStatus,
    subscriptionExpired: subscriptionExpired,
    planID: planID,
    // Workouts
    hasLevel: hasLevel,
    hasWorkouts: hasWorkouts,
    missedWorkouts: missedWorkouts,
    // Access Level
    accessLevel: accessLevel,
    nonAdminAccess: nonAdminAccess
  };
}