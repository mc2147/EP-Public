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
    var salt = generateSalt();
    if (P1 == P2) {
        var hashedPassword = generateHash(P1, salt);
        var newUser = await _models.User.create({
            // id: 29,
            username: username,
            salt: salt,
            password: hashedPassword
        });
        if (newUser) {
            return {
                newUser: newUser,
                session: {
                    userId: newUser.id,
                    username: username,
                    User: newUser
                }
            };
        } else {
            return {
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
    } else {
        _User.level = 6;
    }
    await _User.save();
}

async function accessInfo(user) {
    var response = Object.assign({}, user);
    var Now = new Date(Date.now());
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
    var subscriptionStatus = null;
    if (!user.level || user.level == 0 || user.level == null) {
        hasLevel = false;
    }
    if (user.workoutDates.length > 0) {
        hasWorkouts = true;
    }
    for (var K in user.workouts) {
        var W = user.workouts[K];
        var wDate = new Date(W.Date);
        if ( //If there's an incomplete workout before the current date
        !W.Completed && wDate && wDate.getDate() < Now.getDate() && wDate.getMonth() <= Now.getMonth()) {
            missedWorkouts = true;
            break;
        }
    }
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
        missedWorkouts: missedWorkouts
        // console.log
    };return {
        // Stripe & Subcriptions
        hasStripe: hasStripe,
        hasSubscription: hasSubscription,
        subscriptionValid: subscriptionValid,
        subscriptionStatus: subscriptionStatus,
        subscriptionExpired: subscriptionExpired,
        // Workouts
        hasLevel: hasLevel,
        hasWorkouts: hasWorkouts,
        missedWorkouts: missedWorkouts
    };
}