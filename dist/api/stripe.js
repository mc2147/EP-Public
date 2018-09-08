'use strict';

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const session = require('express-session');
var bodyParser = require('body-parser');
var express = require('express');
var bcrypt = require('bcryptjs');
var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
var router = express.Router();
// import {signupUser} from './apiFunctions/userFunctions';
// import {assignWorkouts, assignLevel, getblankPatterns, rescheduleWorkouts} from './apiFunctions/workoutFunctions';
// import {generateHash} from './apiFunctions/userFunctions';
// import {updateSpecial} from './apiFunctions/workoutUpdate'
// import {generateWorkouts} from './apiFunctions/generateWorkouts';
// import {vueStats, getVueStat, vueProgress} from './vueFormat';
// import {LevelUpMesssages} from '../content/levelupMessages'
// import {Exercise, WorkoutTemplate, SubWorkoutTemplate, Workout, User} from '../models';
// import moment from 'moment';

router.get("/customers", async function (req, res) {
    var stripeCustomers = await stripe.customers.list({ limit: 100 });
    res.json(stripeCustomers);
});

router.get("/customers-custom", async function (req, res) {
    var stripeCustomers = await stripe.customers.list({ limit: 100 });

    for (var i = 0; i < stripeCustomers.data.length; i++) {
        var customer = stripeCustomers.data[i];
        var charges = await stripe.charges.list({ customer: customer.id });
        stripeCustomers.data[i].charges = charges;
    }
    //Get all subscribers
    //List their current subscription, payments, sign up date, current subscription status
    res.json(stripeCustomers);
});

router.get("/subscriptions", async function (req, res) {
    var stripeSubscriptions = await stripe.subscriptions.list();
    res.json(stripeSubscriptions);
});

router.get("/plans", async function (req, res) {
    var plans = await stripe.plans.list();
    res.json(plans);
});

router.get("/charges", async function (req, res) {
    var charges = await stripe.charges.list();
    res.json(charges);
});

module.exports = router;