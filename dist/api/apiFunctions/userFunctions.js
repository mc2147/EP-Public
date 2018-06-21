'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.generateHash = generateHash;
exports.signupUser = signupUser;
exports.assignLevel = assignLevel;
exports.accessInfo = accessInfo;

var _functions = require('../../globals/functions');

var _data = require('../../data');

var _enums = require('../../globals/enums');

var _models = require('../../models');

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _bcryptjs = require('bcryptjs');

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
    var squatWeight = input.squatWeight,
        benchWeight = input.benchWeight,
        RPEExp = input.RPEExp,
        bodyWeight = input.bodyWeight;

    if (squatWeight < benchWeight) {
        _User.level = 1;
    } else if (squatWeight > bodyWeight * 1.5 && benchWeight > bodyWeight && RPEExp) {
        _User.level = 11;
        _User.blockNum = 1;
    } else {
        _User.level = 6;
    }
    await _User.save();
}

async function accessInfo(user) {
    var timezoneOffset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    var TZOffset = parseInt(user.TZOffset);
    console.log('TZOffset: ', TZOffset);
    var response = Object.assign({}, user);
    var Now = new Date(Date.now() - TZOffset * 1000 * 60 * 60);
    // Workouts
    var hasLevel = true; //send to enter stats page
    var initialized = user.initialized;
    var hasWorkouts = false; //level-up get-next-workouts or get-initial-workouts
    var missedWorkouts = false; //reschedule workouts prompt
    // Stipe & Subscription
    var hasStripe = false;
    var hasSubscription = false;
    var subscriptionValid = false;
    var subscriptionExpired = false;
    // let initialized = false;
    var subscriptionStatus = null;
    var accessLevel = 0;
    // 
    console.log('user access info ');
    // console.log("user (accessInfo): ", user);
    if (user.stripeId != "") {
        try {
            var stripeUser = await stripe.customers.retrieve(user.stripeId);
            if (stripeUser.subscriptions.data.length > 0) {
                hasSubscription = true;
                subscriptionStatus = stripeUser.subscriptions.data[0].status;
                if (subscriptionStatus == 'trialing' || subscriptionStatus == 'active') {
                    subscriptionValid = true;
                } else {
                    subscriptionExpired = true;
                }
            }
            hasStripe = true;
        } catch (error) {
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
        console.log('wDate: ', wDate);
        if ( //If there's an incomplete workout before the current date
        !W.Completed && wDate && wDate.getDate() < Now.getDate() && wDate.getMonth() <= Now.getMonth() && wDate.getYear() <= Now.getYear()) {
            missedWorkouts = true;
            break;
        }
    }
    var output = {
        // Stripe & Subcriptions
        hasStripe: hasStripe,
        hasSubscription: hasSubscription,
        subscriptionValid: subscriptionValid,
        subscriptionStatus: subscriptionStatus,
        subscriptionExpired: subscriptionExpired,
        // Workouts
        hasLevel: hasLevel,
        hasWorkouts: hasWorkouts,
        missedWorkouts: missedWorkouts,
        initialized: initialized
        // console.log
    };if (hasSubscription) {
        accessLevel = 1;
    }
    if (hasSubscription && hasLevel) {
        accessLevel = 2;
    }
    if (hasSubscription && hasLevel && initialized) {
        accessLevel = 3;
    }
    if (hasSubscription && hasLevel && initialized && subscriptionValid) {
        accessLevel = 4;
    }
    if (hasSubscription && hasLevel && initialized && subscriptionValid && hasWorkouts) {
        accessLevel = 5;
    }
    if (hasSubscription && hasLevel && initialized && subscriptionValid && hasWorkouts && !missedWorkouts) {
        accessLevel = 6;
    }
    var nonAdminAccess = accessLevel;
    if (user.isAdmin) {
        accessLevel = 6;
    }
    console.log("accessLevel (accessInfo): ", accessLevel);
    return {
        // Stripe & Subcriptions
        hasStripe: hasStripe,
        hasSubscription: hasSubscription,
        subscriptionValid: subscriptionValid,
        subscriptionStatus: subscriptionStatus,
        subscriptionExpired: subscriptionExpired,
        // Workouts
        hasLevel: hasLevel,
        hasWorkouts: hasWorkouts,
        missedWorkouts: missedWorkouts,
        // Access Level
        accessLevel: accessLevel,
        nonAdminAccess: nonAdminAccess
    };
}