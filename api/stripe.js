// const session = require('express-session');
import session from 'express-session';
import Promise from "bluebird";
var bodyParser = require('body-parser');
var express = require('express');
const bcrypt    = require('bcryptjs');
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

let allErrors = [];

router.get("/customers", async function (req, res) {
    let stripeCustomers = await stripe.customers.list({limit: 100});
    res.json(stripeCustomers);
});

router.post('/update-card', async function(req, res) {
    console.log('update-card hit. req.body: ', req.body);
    try {
        let stripeId = req.body.stripeId;
        let stripeUser = await stripe.customers.retrieve(stripeId);
        let stripeToken = req.body.stripeToken;
        await stripe.customers.update(stripeId, {
            source: stripeToken,
        });
        res.json({
            success: true,
        })
        return
    } 
    catch (error) {
        allErrors.push(error);
        console.log('update card error: ', error);
        res.json({error, fail: true})
        return        
    }
})

router.get('errors', async function(req, res) {
    res.json(errors);
})

router.get("/customers-custom", async function (req, res) {
    let stripeCustomers = await stripe.customers.list({limit: 50});

    for (var i = 0; i < stripeCustomers.data.length; i ++) {
        let customer = stripeCustomers.data[i];
        let charges = await stripe.charges.list({customer:customer.id});
        let subscriptions = customer.subscriptions.data;
        customer.subscriptionStatus = 'None';
        customer.MRR = 0;
        if (subscriptions.length > 0) {
            let currentSubscription = subscriptions[0];
            customer.subscriptionStatus = currentSubscription.status;
            customer.MRR = currentSubscription.plan.amount / currentSubscription.plan.interval_count;
            customer.subscriptionPlan = currentSubscription.plan.nickname;
        }
        let totalBilled = 0;
        charges.data.forEach(charge => {
            totalBilled += charge.amount - charge.amount_refunded;
        })
        customer.totalBilled = totalBilled;
        customer.charges = charges.data;
        console.log('adding charges: ', i);
    }
    //Get all subscribers
    //List their current subscription, payments, sign up date, current subscription status
    res.json(stripeCustomers);
});


router.get("/subscriptions", async function (req, res) {
    let stripeSubscriptions = await stripe.subscriptions.list();
    res.json(stripeSubscriptions);
});

router.get("/plans", async function (req, res) {
    let plans = await stripe.plans.list();
    res.json(plans);
});

router.get("/charges", async function (req, res) {
    let charges = await stripe.charges.list();
    res.json(charges);
});

module.exports = router;