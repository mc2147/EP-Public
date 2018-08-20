// const session = require('express-session');
import session from 'express-session';
import Promise from "bluebird";
var bodyParser = require('body-parser');
var express = require('express');
const bcrypt = require('bcryptjs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
import { getSubscriptionInfo } from './apiFunctions/stripeFunctions';
import { signupUser, accessInfo } from './apiFunctions/userFunctions';
import { assignWorkouts, assignLevel, getblankPatterns, rescheduleWorkouts } from './apiFunctions/workoutFunctions';
import { generateHash } from './apiFunctions/userFunctions';
import { updateSpecial } from './apiFunctions/workoutUpdate'
import { generateWorkouts } from './apiFunctions/generateWorkouts';
import { vueStats, getVueStat, vueProgress } from './vueFormat';
import { LevelUpMesssages } from '../content/levelupMessages'
import { sendMail, testEmail } from './email';
var router = express.Router();
import { Exercise, WorkoutTemplate, SubWorkoutTemplate, Workout, User } from '../models';
import moment from 'moment';
import { ExercisesJSON } from '../data';
var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
console.log('secret key: ', process.env.STRIPE_SECRET_KEY)
// var models = require('../models');
// 	var Exercise = models.Exercise;
// 	var WorkoutTemplate = models.WorkoutTemplate;
// 	var SubWorkoutTemplate = models.SubWorkoutTemplate;
// 	var Workout = models.Workout;
// 	var User = models.User;
const path = require('path');
const ABSPATH = path.dirname(process.mainModule.filename); // Absolute path to our app directory
// let data = require('../data');
import axios from 'axios';
import data from '../data';
var W3a = data.AllWorkouts[3]["a"];
var RPETable = data.RPETable;
var Exercises = data.ExerciseDict;
var VideosJSON = data.VideosJSON;
var LevelVideos = data.LevelVideos;
var VideosVue = data.VideosVue;
var DescriptionsJSON = data.DescriptionsJSON;
var allWorkoutJSONs = data.AllWorkouts;

var globalFuncs = require('../globals/functions');
var getMax = globalFuncs.getMax;
var getWeight = globalFuncs.getWeight;
var getWorkoutDates = globalFuncs.getWorkoutDays;
var G_getPattern = globalFuncs.getPattern;
var dateString = globalFuncs.dateString;

import { Alloy, DaysofWeekDict } from '../globals/enums';
// var globalEnums = require('../globals/enums');
// var DaysofWeekDict = globalEnums.DaysofWeekDict;
// var Alloy = globalEnums.Alloy;
// Move below to apiFunctions later under workoutFunctions 
var workoutHandlers = require('../routes/workoutHandlers');
var saveWorkout = workoutHandlers.saveWorkout;

var vueAPI = require('../routes/vueAPI');
var getVueInfo = vueAPI.getVueInfo;

var cron = require('node-cron');

let missedWorkoutsEmailHTML = (
    `<p>This is an email to notify you that you have incomplete workouts on your Electrum Performance account.</p>`
    + `<p>What this means is you have passed the completion date of a workout without clicking the "Submit" button from the workout page.`
    + `Next time you log in, you will be prompted to reschedule your workouts for a future date before being able to enter inputs for upcoming workouts.`
    + `Simply follow the prompt to reschedule your incomplete workouts and you will be able to continue with the program!</p>`);

async function checkMissedWorkouts() {
    let liveUsers = await User.findAll({
        where: {
            username: {
                [Op.notIn]: testUsernames,
            }
        }
    });
    for (var i = 0; i < liveUsers.length; i++) {
        let thisUser = liveUsers[i];
        let thisaccessInfo = await accessInfo(thisUser);
        if (thisaccessInfo.missedWorkouts) {
            if (!thisUser.notifiedMissedWorkouts) {
                // [Electrum Performance] Incomplete Workouts
                // <p>This is an email to notify you that you have incomplete workouts on your Electrum Performance account.
                // What this means is you have passed the completion date of a workout without clicking "Submit" on the workout page.
                // Next time you log in, you will be prompted to reschedule your workouts for a future date. 
                // Once you do that, you wil be able to access your workouts again!
                // To prevent incomplete workouts in the future, make sure you click "Submit" after filling in the information for each workout
                let emailJSON = {
                    from: '"Electrum Performance" <electrumperformance@gmail.com>',
                    to: thisUser.username,
                    subject: `[Electrum Performance] Incomplete Workouts`,
                    html: missedWorkoutsEmailHTML
                };
                let mailResponse = {};
                mailResponse = sendMail(emailJSON);
                thisUser.notifiedMissedWorkouts = true;
                await thisUser.save();
                return
            }
        }
    }

}

cron.schedule('8 00 * * *', async function () {
    console.log('Executing every day: ', Date.now());
    await checkMissedWorkouts();
    console.log('Checked missed workouts!!');
    // For all users, check if they have missed workouts
    // If missed workout and not notified, send an email
});

// cron.schedule('* * * * *', function() {
//     // console.log('Executing every minute? ', Date.now());
// });


let testUsernames = [
    'UserName1', 'UserName2', "UserName3", "UserName4", 'UserName5', 'UserName6',
    'AdminUser',
    'AdminBryce', 'AdminSterner', 'AdminChan', 'AdminSitwala', 'mc2147', 'BetaSitwala',
    'ABradley', 'ASterczala', 'ACalderone',
    'DemoBeta'];

router.get("/", function (req, res) {
    req.session.set = true;
    User.findAll({
        where: {
            username: {
                [Op.notIn]: testUsernames,
            }
        },
        order: [
            ['createdAt', 'DESC'],
        ],
    }).then((users) => {
        res.json(users);
    })
});

router.get('/test/missed-workout-email', async function (req, res) {
    let emailJSON = {
        from: '"Electrum Performance" <electrumperformance@gmail.com>',
        to: 'matthewchan2147@gmail.com',
        subject: `[Electrum Performance] Incomplete Workouts Test`,
        html: missedWorkoutsEmailHTML
    };
    let mailResponse = {};
    mailResponse = sendMail(emailJSON);
    res.json('Email Sent!');
})

router.post('/contact-form', async function (req, res) {
    let { name, email, messageBody, messageType } = req.body;
    console.log('req.body: ', req.body);

    // messageBody = messageBody.replace(/\n/g, "<br />");

    let emailHTML = (
        `<b>Name: </b> ${name}<br><br>` +
        `<b>Email: </b> ${email}<br><br>` +
        `<b>Message Type: </b> ${messageType}<br><br>` +
        `<b>Message Body: </b> <pre>${messageBody}</pre><br><br>`);

    let emailJSON = {
        from: '"Electrum Performance" <electrumperformance@gmail.com>',
        to: 'electrumperformance@gmail.com',
        subject: `[Electrum Performance] Contact Form Submission - ${email}`,
        html: emailHTML
    };
    let mailResponse = {};
    mailResponse = sendMail(emailJSON);
    res.json(mailResponse);
    // if (mailResponse.success) {
    //     res.json({
    //         success:true,
    //     });    
    // }
    // else if (mailResponse.error) {
    //     res.json({
    //         error:true,
    //     });    
    // }
});

router.post('/purchase/galvao-pdf', async function (req, res) {
    console.log('purchase route hit!! req.body: ', req.body);
    console.log('ABSPATH: ', ABSPATH);
    let itemPath = ABSPATH + '/products/Demo.pdf';
    let { buyerEmail } = req.body;
    let itemName = 'Galvao PDF';
    let emailHTML = (
        `<p>Thank you for your purchase! Your copy of ${itemName} is attached to this email. </p>`);

    let emailJSON = {
        from: '"Electrum Performance" <electrumperformance@gmail.com>',
        to: buyerEmail,
        subject: `[Electrum Performance] Your Downloadable Purchase`,
        html: emailHTML,
        attachments: [
            {   // filename and content type is derived from path
                path: itemPath
            },
        ]
    };
    let mailResponse = {};
    mailResponse = sendMail(emailJSON);
    res.json(mailResponse);

});

let IPForm = {
    Name: 'Please write out your name',
    PastInjuries: 'Do you have any past injuries that we should keep in mind while designing your program? (please include the type of injury, date it occurred, and current state)',
    Experience: 'What is your strength training experience?',
    Equipment: 'What equipment do you have at your disposal? (commercial fitness facility, home gym, etc.)',
    Goals: 'What are your short and long term goals as they pertain to strength training? Goals regarding your respective sport? (change in weight class, strength in specific positions, etc.)',
    IncludeExercises: 'Are there any specific exercises you would like us to include?',
    AvoidExercises: 'Are there any specific exercises you would like to avoid? Why?',
    TrainingDays: 'How many days per week would you like to train? (if unsure we will program 3)',
};

router.post('/individualized-program', async function (req, res) {
    let input = req.body;
    console.log('input for individualized programming route: ', input);
    if (input.payment) {
        // Create stripe customer here with card and email
        // Link later information to stripe customer email
        // Send email to Alex's notifying them of a customer's signup
        let emailHTML = (`<p>A new user has paid for individualized programming! You can reach them at ${input.email}</p><br>`);
        let email = {
            from: '"Electrum Performance" <electrumperformance@gmail.com>',
            to: 'electrumperformance@gmail.com',
            subject: `[Individualized Programming] Payment from ${input.email}`,
            html: emailHTML
        };
        sendMail(email);
        res.json('individualized program payment');
        return
    }
    else if (input.IPinformation) {
        let formInfo = input.FormInfo;
        let emailHTML = (`<p>This is the individualized programming information for: ${formInfo.Name} (${input.email})</p><br>`);
        for (var key in IPForm) {
            let question = IPForm[key];
            let answer = formInfo[key];
            emailHTML += `<b>${question}</b><br>`;
            emailHTML += `<p>${answer}</p><br>`;
        }
        let email = {
            from: '"Electrum Performance" <electrumperformance@gmail.com>',
            to: 'electrumperformance@gmail.com',
            subject: `[Individualized Programming] Information for ${input.email}`,
            html: emailHTML
        };
        sendMail(email);
        res.json('individualized program information');
        return
    }
    // Create stripe customer here with card and email
    // Link later information to stripe customer email
    // Send email to Alex's notifying them of a customer's signup
    // let confHTML = (`<p>This is the confirmation email for your Electrum Performance
    //  account for: ${user.username} `
    // + 'Please click the link below to activate your account:<br><br>'
    // + `<a href="${realconfURL}"><b>Activate Your Account</b></a></p>`
    // + "<br>If the above link doesn't work, navigate to this URL in your browser:<br>"
    // + realconfURL
    // + "<br><br><b>Note: we have a known issue with confirmation links malfunctioning on Apple's Safari browser. "
    // + "If the above link doesn't work for you, please try copying it into a non-Safari browser such as Google Chrome or Internet Explorer. </b>"
    // + "<b> If you continue to experience difficulty with confirming your account, please reply to this email and we will confirm your account manually.</b>");
    // let confEmail = {
    //     from: '"Electrum Performance" <electrumperformance@gmail.com>',
    //     // to: ['matthewchan2147@gmail.com', 'asitwala17@gmail.com'], //later: user.username,
    //     to: user.username,
    //     subject: 'Account Confirmation [Electrum Performance]',
    //     // text: `Your new password for AlloyStrength Training is: ${newPassword}`
    //     html: confHTML
    // };
    // sendMail(confEmail);
})

router.post('/individualized-program/info', async function (req, res) {
    let input = req.body;
    //
    res.json('individualized programming info route!!');
})


router.get("/names", async function (req, res) {
    req.session.set = true;
    User.findAll({
        where: {
            username: {
                [Op.notIn]: testUsernames,
            },
        }
    }).then((users) => {
        let output = {};
        let namesArray = [];
        let emailAllString = "";
        users.forEach(user => {
            namesArray.push([user.username, user.name]);
            emailAllString += user.username + ', ';
        })
        output = {
            namesArray,
            emailAllString,
        };
        res.json(output);
    })
});

router.get('/names/not-confirmed', async function (req, res) {
    User.findAll({
        where: {
            username: {
                [Op.notIn]: testUsernames,
            },
            active: false,
        }
    }).then((users) => {
        let output = {};
        let namesArray = [];
        let emailAllString = "";
        users.forEach(user => {
            namesArray.push([
                user.username,
                user.name,
                { active: user.active }
            ]);
            emailAllString += user.username + ', ';
        })
        let count = namesArray.length;
        output = {
            count,
            namesArray,
            emailAllString,
        };
        res.json(output);
    })
})

router.get('/names/not-subscribed', async function (req, res) {
    User.findAll({
        where: {
            username: {
                [Op.notIn]: testUsernames,
            },
            stripeId: ""
        }
    }).then((users) => {
        let output = {};
        let namesArray = [];
        let emailAllString = "";
        users.forEach(user => {
            namesArray.push([
                user.username,
                user.name,
                { stripeId: user.stripeId, active: user.active }]);
            emailAllString += user.username + ', ';
        })
        let count = namesArray.length;
        output = {
            count,
            namesArray,
            emailAllString,
        };
        res.json(output);
    })
})

router.get('/names/active-not-subscribed', async function (req, res) {
    User.findAll({
        where: {
            username: {
                [Op.notIn]: testUsernames,
            },
            active: true,
            stripeId: "",
        }
    }).then((users) => {
        let output = {};
        let namesArray = [];
        let emailAllString = "";
        users.forEach(user => {
            namesArray.push([
                user.username,
                user.name,
                { stripeId: user.stripeId, active: user.active }]);
            emailAllString += user.username + ', ';
        })
        let count = namesArray.length;
        output = {
            count,
            namesArray,
            emailAllString,
        };
        res.json(output);
    })
})


router.get("/test", function (req, res) {
    User.findAll({
        where: {
            username: {
                [Op.in]: testUsernames,
            }
        }
    }).then((users) => {
        res.json(users);
    })
});

router.get('/test-stripe', async function (req, res) {
    try {
        let stripeUser = await stripe.customers.create({
            // source:stripeToken,
            email: 'test@test.com',
        });
        let testSubscription = await stripe.subscriptions.create({
            customer: stripeUser.id,
            items: [
                {
                    // plan:"AS_Silver",
                    plan: "AS_Trial",
                },
            ],
            trial_from_plan: true,
        });
        let updatedStripeUser = await stripe.customers.retrieve(stripeUser.id);
        res.json({
            customer: updatedStripeUser,
            subscription: testSubscription
        });
    }
    catch (err) {
        res.json(err);
    }
})


// Inputs: email, name, 
router.post("/", async function (req, res) {
    console.log('Signing up user');
    var newUser = await signupUser(req.body);
    if (newUser.userExists) {
        console.log('user already exists!!!');
        res.json({
            userExists: true,
        })
        return
    }
    if (newUser == false) {
        console.log('bad user signup submission!')
        res.json({
            error: true,
            status: "passwords no match",
        })
        return
    }
    else {
        // req.session
        req.session.userId = newUser.session.userId;
        req.session.username = newUser.session.username;
        req.session.User = newUser.session.User;
        req.session.test = "test";
        req.session.save();
        console.log("user post req.session: ", req.session);
        // await req.session.save();
        res.json(newUser);
    }
    // res.json(req.session);
})

router.post("/:username/login", async function (req, res) {
    console.log("username/login route hit", req.body);
    let TZOffset = req.body.timezoneOffset;
    req.session.timezoneOffset = req.body.timezoneOffset;
    console.log('TZOffset: ', TZOffset);
    var username = req.params.username;
    var passwordInput = req.body.password;
    let Now = new Date(Date.now());
    var loginUser = await User.findOne({
        where: {
            username,
        }
    });
    loginUser.TZOffset = TZOffset;
    await loginUser.save();
    let viewingWID = 1;
    let nextWorkoutFound = false;
    if (!loginUser) {
        res.json({
            Success: false,
            Found: false,
            Status: "No user found"
        });
    }
    else {
        var hashed = User.generateHash(passwordInput, loginUser.salt);
        if (hashed == loginUser.password) {
            let hasWorkouts = (Object.keys(loginUser.workouts).length > 0);
            loginUser.missedWorkouts = false;
            for (var K in loginUser.workouts) {
                let W = loginUser.workouts[K];
                let wDate = new Date(W.Date);
                if (
                    //If there's an incomplete workout before the current date
                    wDate
                    && wDate.getDate() < Now.getDate()
                    && wDate.getMonth() <= Now.getMonth()) {
                    if (!W.Completed) {
                        loginUser.missedWorkouts = true;
                    }
                }
                else {
                    if (!nextWorkoutFound) {
                        viewingWID = K;
                    }
                    nextWorkoutFound = true;
                }
            }
            // loginuser.workoutDates.forEach((elem, ))
            let paid = false;
            let hasSubscription = false;
            let subscriptionValid = false;
            let subscriptionStatus = false;
            if (loginUser.stripeId != "") {
                try {
                    let stripeUser = await stripe.customers.retrieve(loginUser.stripeId);
                    paid = true;
                    if (stripeUser.subscriptions.data.length > 0) {
                        hasSubscription = true;
                        subscriptionStatus = stripeUser.subscriptions.data[0].status;
                        if (subscriptionStatus == 'trialing' || subscriptionStatus == 'active') {
                            subscriptionValid = true;
                        }
                    }
                }
                catch (error) {
                    paid = false;
                    hasSubscription = false;
                    subscriptionValid = false;
                }
            }
            let userAccess = await accessInfo(loginUser);
            res.json({
                Success: true,
                Found: true,
                Status: "Success",
                User: loginUser,
                viewingWID,
                hasWorkouts,
                subscriptionValid,
                hasSubscription,
                subscriptionStatus,
                accessInfo: userAccess,
            });
        }
        else {
            res.json({
                Success: false,
                Found: true,
                Status: "Incorrect Password!"
            });
        }
    }
})

// router.get('/:id/forgot-password', async function(req, res) {
router.post('/forgot-password', async function (req, res) {
    let username = req.body.email;
    // testEmail:
    console.log("forgot password route hit");
    // let user = await User.findById(req.params.id);
    let user = await User.findOne({
        where: {
            username
        }
    });
    console.log('changing password for user: ', user.username);
    let newPassword = Math.random().toString(36).slice(-8);
    let newHash = generateHash(newPassword, user.salt);
    user.password = newHash;
    await user.save();
    let passwordEmail = {
        from: '"Electrum Performance" <electrumperformance@gmail.com>',
        // to: ['matthewchan2147@gmail.com', 'asitwala17@gmail.com'], //later: user.username,
        to: user.username,
        subject: 'Password Reset [Electrum Performance]',
        text: `Your new password for Electrum Performance is: ${newPassword}`
    };
    sendMail(passwordEmail);
    res.json({
        newPassword,
        newHash,
        passwordEmail
    });
})

// router.get('/:id/confirmation-email', async function(req, res) {
router.post('/:id/confirmation-email', async function (req, res) {
    console.log("posting to confirmation email");
    let user = await User.findById(req.params.id);
    let confString = Math.random().toString(36).slice(-8);
    // Assign confString to the user
    user.confString = confString;
    await user.save();
    let productionconfURL = `${process.env.BASE_URL}/api/users/${req.params.id}/confirm/${confString}`;
    let realconfURL = `https://www.electrumperformance.com/confirm/${req.params.id}/${confString}`;
    // console.log('confURL: ', confURL);
    let confHTML = (`<p>This is the confirmation email for your Electrum Performance
     account for: ${user.username} `
        + 'Please click the link below to activate your account:<br><br>'
        + `<a href="${realconfURL}"><b>Activate Your Account</b></a></p>`
        + "<br>If the above link doesn't work, navigate to this URL in your browser:<br>"
        + realconfURL
        + "<br><br><b>Note: we have a known issue with confirmation links malfunctioning on Apple's Safari browser. "
        + "If the above link doesn't work for you, please try copying it into a non-Safari browser such as Google Chrome or Internet Explorer. </b>"
        + "<b> If you continue to experience difficulty with confirming your account, please reply to this email and we will confirm your account manually.</b>");

    let confEmail = {
        from: '"Electrum Performance" <electrumperformance@gmail.com>',
        // to: ['matthewchan2147@gmail.com', 'asitwala17@gmail.com'], //later: user.username,
        to: user.username,
        subject: 'Account Confirmation [Electrum Performance]',
        // text: `Your new password for AlloyStrength Training is: ${newPassword}`
        html: confHTML
    };
    sendMail(confEmail);
    res.json(confEmail);
})

router.get('/:id/confirm/:confString', async function (req, res) {
    let user = await User.findById(req.params.id);
    let confString = req.params.confString;
    console.log("activating account: ", req.params.confString);
    if (user.active) {
        return res.json({
            alreadyConfirmed: true,
        })
    }
    if (confString == user.confString) {
        user.active = true;
        await user.save();
        return res.json({
            match: true,
            confString: req.params.confString,
        });
    }
    else {
        return res.json({
            match: false,
            confString: req.params.confString,
        });
    }
})

// On change subscription: 
//cancel_at_period_end = true;
//create new subscription with billing_cycle_anchor at period_end
// Plan IDs: AS_Bronze, AS_Silver, AS_Gold
// req.body: newPlanID, cancel (bool)
router.put('/:id/change-subscription', async function (req, res) {
    let user = await User.findById(req.params.id);
    console.log("changing subscription for user: ", user.username);
    console.log("   req.body: ", req.body);
    let newPlanID = req.body.newPlanID;
    let stripeUser = await stripe.customers.retrieve(user.stripeId);
    let subscriptions = stripeUser.subscriptions;
    let subscriptionId = ""; //Gets assigned to be user's latest subscription
    let currentSubscription = {};
    if (subscriptions.data.length > 0) {
        let nSubs = subscriptions.data.length;
        subscriptionId = subscriptions.data[0].id;
        currentSubscription = subscriptions.data[0];
    }

    if (req.body.cancel) {
        let cancelSubscription = await stripe.subscriptions.del(subscriptionId, {
            at_period_end: true,
        })
        if (currentSubscription.status == 'trialing') {
            await stripe.subscriptions.del(subscriptionId, {});
        }
        // let updatedSubscription = await stripe.subscriptions.retrieve(user.stripeId);
        console.log("cancelling... ", cancelSubscription);
        res.json(cancelSubscription);
        return
    }
    else {
        await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true,
        });
        if (currentSubscription.status == 'trialing') {
            await stripe.subscriptions.del(subscriptionId);
        }
        //Trialing is used to not start a different subscription until the current one ends
        let newSubscription = await stripe.subscriptions.create({
            customer: user.stripeId,
            billing_cycle_anchor: currentSubscription.current_period_end,
            trial_end: currentSubscription.current_period_end,
            items: [
                {
                    plan: req.body.newPlanID,
                },
            ],
        });
        console.log("changing... ", newSubscription);
        res.json(newSubscription);
        return
    }
    // let 
})

router.get('/:id/stripe-customer', async function (req, res) {
    let user = await User.findById(req.params.id);
    try {
        let stripeUser = await stripe.customers.retrieve(user.stripeId);
        res.json(stripeUser);
    }
    catch (err) {
        res.json(err);
    }
})

router.get('/:id/active-subscription', async function (req, res) {
    let user = await User.findById(req.params.id);
    let stripeUser = await stripe.customers.retrieve(user.stripeId);
    let subscriptionsList = stripeUser.subscriptions.data;
    subscriptionsList.forEach(sub => {
        if (sub.status == 'active') {
            res.json(sub);
            return
        }
    })
    res.json({
        noActiveSubscriptions: true,
    })
})

router.get('/:id/active-subscription-info', async function (req, res) {
    let user = await User.findById(req.params.id);
    let stripeUser = await stripe.customers.retrieve(user.stripeId);
    let subscriptionsList = stripeUser.subscriptions.data;
    subscriptionsList.forEach(sub => {
        if (sub.status == 'active') {
            res.json(getSubscriptionInfo(sub));
            return
        }
    })
    res.json({
        noActiveSubscriptions: true,
    })
})


router.get('/:id/first-subscription', async function (req, res) {
    let user = await User.findById(req.params.id);
    let stripeUser = await stripe.customers.retrieve(user.stripeId);
    let subscriptions = stripeUser.subscriptions;
    if (subscriptions.data.length > 0) {
        res.json(subscriptions.data[0]);
        return
    }
    else {
        res.json({
            noSubscriptions: true,
        })
        return
    }
})

router.get('/:id/first-subscription-info', async function (req, res) {
    console.log("line 154 users.js");
    let user = await User.findById(req.params.id);
    let stripeUser = await stripe.customers.retrieve(user.stripeId);
    let subscriptions = stripeUser.subscriptions;
    if (subscriptions.data.length > 0) {
        let current = subscriptions.data[0];
        let information = getSubscriptionInfo(current);
        res.json(information);
        return
    }
    else {
        res.json({
            noSubscriptions: true,
        })
        return
    }
})

//0 index is most recent
router.get('/:id/subscription-info', async function (req, res) {
    let user = await User.findById(req.params.id);
    let stripeUser = await stripe.customers.retrieve(user.stripeId);
    let subscriptionList = stripeUser.subscriptions.data;
    let firstSubscription = subscriptionList[0];
    let firstActiveSubscription = {};
    let subscriptionDescriber = "";
    let currentPlan = "";
    let endDateString = "";
    let trialendDateString = "";
    let nextPlan = false;
    let cancelled = false;
    // let new
    let secondLine = "";
    // if (subscriptionStatus == 'trialing' || subscriptionStatus == 'active') {
    //     subscriptionValid = true;
    // }
    for (let i = 0; i < subscriptionList.length; i++) {
        let thisSub = subscriptionList[i];
        if (thisSub.status == 'active') {
            firstActiveSubscription = thisSub;
            currentPlan = firstActiveSubscription.plan.nickname;
            let endDate = new Date(firstActiveSubscription.current_period_end * 1000);
            endDateString = dateString(endDate);
            subscriptionDescriber = (`Your current subscription is ${currentPlan} `
                + `and lasts until ${endDateString}.`);
            break
        }
    }
    if (firstSubscription.cancel_at_period_end) {
        subscriptionDescriber += ` It has been cancelled and will expire after this date.`
        secondLine = ` It has been <b style="color:#f44336;">cancelled</b> and will expire after this date.`;
        cancelled = true;
    }
    else if (firstSubscription.status == 'trialing') {
        if (subscriptionList.length == 1) {
            let trialEndDate = new Date(firstSubscription.trial_end * 1000);
            trialendDateString = dateString(trialEndDate);
            subscriptionDescriber = `Your trial period will end on ${trialendDateString},`
                + ` after which you will be billed automatically.`;
            secondLine = subscriptionDescriber;
            // subscriptionDescriber += ` It will change to ${nextPlanString} on this date.`
            // secondLine = ` It will change to ${nextPlanString} on this date.`;
        }
        else {
            nextPlan = firstSubscription.plan.nickname;
            let nextPlanString = nextPlan;
            if (nextPlan == 'Silver') {
                nextPlanString = `<b style="color:#bdbdbd;">${nextPlan}</b>`
            }
            else if (nextPlan == 'Gold') {
                nextPlanString = `<b style="color:#ffca28;">${nextPlan}</b>`
            }
            subscriptionDescriber += ` It will change to ${nextPlanString} on this date.`
            secondLine = ` It will change to ${nextPlanString} on this date.`;
        }
    }
    else if (firstSubscription.status == 'active') {
        subscriptionDescriber += ` It will renew automatically.`
        secondLine = ` It will renew automatically.`;
    }

    res.json({
        cancelled,
        describer: subscriptionDescriber,
        currentPlan,
        endDateString,
        nextPlan,
        secondLine
    });
})

//0 index is most recent
router.get('/:id/all-subscriptions', async function (req, res) {
    let user = await User.findById(req.params.id);
    try {
        let stripeUser = await stripe.customers.retrieve(user.stripeId);
        let subscriptionsList = stripeUser.subscriptions.data;
        let nSubscriptions = stripeUser.subscriptions.data.length;
        let morethan0 = stripeUser.subscriptions.data.length > 0;
        res.json({
            subscriptionsList,
            nSubscriptions,
            morethan0
        });
    }
    catch (error) {
        error.Error = true;
        res.json(error)
    }
})

router.get('/:id/all-subscriptions-info', async function (req, res) {
    let user = await User.findById(req.params.id);
    try {
        let stripeUser = await stripe.customers.retrieve(user.stripeId);
        let subscriptions = stripeUser.subscriptions.data;
        let subscriptionInfo = [];
        subscriptions.forEach(sub => {
            let information = getSubscriptionInfo(sub);
            subscriptionInfo.push(information);
            // console.log("customer subscription information: ", information);
        })
        res.json(subscriptionInfo);
    }
    catch (error) {
        error.Error = true;
        res.json(error);
    }
})

router.post('/:id/start-trial', async function (req, res) {
    let stripeToken = req.body.stripeToken;
    let user = await User.findById(req.params.id);
    console.log('starting trial only');
    // res.json('starting trial');
    if (user.stripeId != "") {
        let userAccessLevel = accessInfo(user);
        let stripeUser = await stripe.customers.retrieve(user.stripeId);
        console.log('already subscribed!!!');
        console.log('existing stripe user: ', stripeUser);

        if (!stripeUser.deleted
            && stripeUser.subscriptions.data.length > 0) {
            res.json({
                alreadySubscribed: true,
            })
            return
        }
        if (userAccessLevel >= 1) {

        }
    }
    try {
        let stripeUser = await stripe.customers.create({
            source: stripeToken,
            email: user.username,
        });
        let newStripeId = stripeUser.id;
        console.log("newStripeId: ", newStripeId);
        user.stripeId = newStripeId;
        await user.save();
        console.log('line 719');
        let newSubscription = await stripe.subscriptions.create({
            customer: stripeUser.id,
            items: [
                {
                    // plan:"AS_Silver",
                    plan: 'AS_Trial',
                },
            ],
            trial_from_plan: true,
        });
        await stripe.customers.update(stripeUser.id, {
            description: 'Subscribed Once',
        });
        let findCustomer = await stripe.customers.retrieve(stripeUser.id);
        console.log("customer found: ", findCustomer);
        res.json(findCustomer);
        return
    }
    catch (error) {
        console.log('PAYMENT ERROR: ', error);
        error.paymentError = true;
        res.json(error);
    }
})

// Plan ID: AS_Bronze, AS_Silver, AS_Gold
router.post('/:id/subscribe', async function (req, res) {
    console.log('SUBSCRIBING...');
    let stripeToken = req.body.stripeToken;
    let planID = req.body.planID;
    console.log("   req.body (api/users): ", req.body);
    let user = await User.findById(req.params.id);
    if (user.stripeId != "") {
        let userAccessLevel = accessInfo(user);
        let stripeUser = await stripe.customers.retrieve(user.stripeId);
        if (stripeUser.subscriptions.data.length > 0) {
            res.json({
                alreadySubscribed: true,
            })
            return
        }
        if (userAccessLevel >= 1) {

        }
    }
    try {
        let stripeUser = await stripe.customers.create({
            source: stripeToken,
            email: user.username,
        });
        let newStripeId = stripeUser.id;
        console.log("newStripeId: ", newStripeId);
        user.stripeId = newStripeId;
        await user.save();
        // if (process.env.TEST_LIVE_STRIPE) {
        //     let newSubscription = await stripe.subscriptions.create({
        //         customer:stripeUser.id,
        //         items: [
        //             {
        //                 // plan:"AS_Silver",
        //                 plan:"AS_Test",
        //             },
        //         ],        
        //     });
        // }
        // else {
        console.log('line 719');
        let newSubscription = await stripe.subscriptions.create({
            customer: stripeUser.id,
            items: [
                {
                    // plan:"AS_Silver",
                    plan: req.body.planID,
                },
            ],
            trial_from_plan: true,
        });
        await stripe.customers.update(stripeUser.id, {
            description: 'Subscribed Once',
        });
        console.log('line 730');
        // }
        let findCustomer = await stripe.customers.retrieve(stripeUser.id);
        console.log("customer found: ", findCustomer);
        res.json(findCustomer);
        return
    }
    catch (error) {
        console.log('PAYMENT ERROR: ', error);
        error.paymentError = true;
        res.json(error);
    }
})

router.post('/:id/renew-subscription', async function (req, res) {
    let user = await User.findById(req.params.id);
    let stripeID = user.stripeId;
    let stripeToken = req.body.stripeToken;
    let planID = req.body.planID;
    console.log("stripeID: ", stripeID, "stripeToken: ", stripeToken, 'planID: ', planID);
    try {
        let stripeCustomer = await stripe.customers.retrieve(stripeID);
        stripeCustomer.subscriptions.data.forEach(async sub => {
            await stripe.subscriptions.update(sub.id, {
                cancel_at_period_end: true,
            });
        })

        console.log("417");
        let stripeCustomerID = stripeCustomer.id;
        let newSubscription = await stripe.subscriptions.create({
            customer: stripeCustomerID,
            items: [
                {
                    plan: planID,
                },
            ],
            // trial_from_plan:true, //for testing only - to avoid an immediate charge
        })
        console.log("line 426");
        let response = await accessInfo(user, req.session.timezoneOffset);
        res.json(response);
        console.log("line 427");
        // // res.json(newSubscription);
        // res.json({
        //     success:true,
        // })
    }
    catch (error) {
        error.Error = true;
        error.paymentError;
        res.json(error);
    }
    // let user = await User.findById(req.params.id);
    // let stripeUser = await stripe.customers.create({
    //     source:stripeToken,
    //     email:user.username,
    // });    
    // let newStripeId = stripeUser.id;
    // console.log("newStripeId: ", newStripeId);
    // user.stripeId = newStripeId;
    // await user.save();
    // let newSubscription = await stripe.subscriptions.create({
    //     customer:stripeUser.id,
    //     items: [
    //         {
    //             plan:"AS_Silver",
    //         },
    //     ],        
    // });
    // let findCustomer = await stripe.customers.retrieve(stripeUser.id);    
    // console.log("customer found: ", findCustomer);
    // res.json(findCustomer); 
    // return        
})

router.get('/:id/reschedule-workouts', async function (req, res) {
    let user = await User.findById(req.params.id);
    let Now = new Date(Date.now());
    let workouts = [];
    for (var K in user.workouts) {
        let W = user.workouts[K];
        let wDate = new Date(W.Date);
        let workoutObj = {
            Week: W.Week,
            Day: W.Day,
            Date: wDate,
            Missed: false,
            Completed: false,
        }
        if (W.Completed) {
            workoutObj.Completed = true;
        }
        else { //If incomplete and less than now
            if ( //Check if date is less than Now
                wDate && wDate.getDate() < Now.getDate()
                && wDate.getMonth() <= Now.getMonth()) {
                workoutObj.Missed = true;
            }
        }
        workouts.push(workoutObj);
    }
    let userAccess = await accessInfo(user, req.session.timezoneOffset);
    let accessLevel = userAccess.accessLevel;
    let response = {
        accessLevel,
        workouts,
    }
    res.json(response);
})

router.post('/:id/reschedule-workouts', async function (req, res) {
    console.log("posting to reschedule... from users api");
    console.log("req.body: ", req.body);
    // console.log("new start date: ", new Date(req.body.restartDate));
    let newStartDate = new Date(req.body.restartDate);
    let Now = new Date(Date.now());
    console.log("/:id/reschedule-workouts route ");
    console.log("   Now: ", Now);
    console.log("   newStartDate ", newStartDate);
    let user = await User.findById(req.params.id);
    if ('DoW' in req.body) {
        let DoWArray = [];
        req.body.DoW.forEach(day => {
            DoWArray.push(parseInt(day));
        })
        // console.log('old workout dates: ', user.workoutDates);
        let newDates = await rescheduleWorkouts(user, newStartDate, DoWArray);
        user.notifiedMissedWorkouts = false;
        await user.save();
        // let dateIndex = 0;
        // for (var K in user.workouts) {
        //     let W = user.workouts[K];
        //     if (!W.Completed) {
        //         W.Date = newDates[dateIndex];
        //     }
        //     dateIndex ++;
        // }
        // await user.changed('workouts', true);
        // await user.save();
        // return newDates;            
    }
    res.json(user);
    // res.redirect('/reschedule');
})

router.post('/:id/payment', async function (req, res) {

});

router.get("/:userId", async function (req, res) {
    let user = await User.findById(req.params.userId);
    res.json(user);
});

router.delete('/:userId/stripe', async function (req, res) {
    let user = await User.findById(req.params.userId);
    try {
        let deletion = await stripe.customers.del(user.stripeId);
        res.json(deletion);
    }
    catch (error) {
        res.json(error);
    }
})

router.get("/:userId/access-info", async function (req, res) {
    let TZOffset = req.body.timezoneOffset;
    req.session.timezoneOffset = req.body.timezoneOffset;
    console.log('TZOffset access-info: ', TZOffset);
    let user = await User.findById(req.params.userId);
    let response = Object.assign({}, user);
    let Now = new Date(Date.now());
    let returnObj = await accessInfo(user, req.session.timezoneOffset);
    res.json(returnObj);
})

router.get("/:userId/workouts", function (req, res) {
    User.findById(req.params.userId).then((user) => {
        res.json(user.workouts);
    });
})

router.get("/:userId/last-workout", async function (req, res) {
    console.log("last-workout route hit!");
    let _User = await User.findById(req.params.userId);
    let response = {
        notFound: true,
        text: "You have no completed workouts!"
    }
    let thisDate = new Date(Date.now() - _User.TZOffset * 1000 * 60 * 60);
    console.log("thisDate 1: ", thisDate);
    // thisDate.setDate(thisDate.getDate() + 7);
    console.log("thisDate: ", thisDate);
    _User.workoutDates.forEach(function (date, index) {
        if (date.getTime() < thisDate.getTime()
            && date.getDate() <= thisDate.getDate()
            && date.getMonth() <= thisDate.getMonth()
            && date.getYear() <= thisDate.getYear()) {
            console.log(date.getDate(), thisDate.getDate());
            let wID = index + 1;
            let relatedWorkout = _User.workouts[wID];
            response = relatedWorkout;
        }
    })
    res.json(response);
    return
});

router.get("/:userId/last-workout/vue", async function (req, res) {
    console.log("last-workout route hit!");
    let _User = await User.findById(req.params.userId);
    let response = {
        notFound: true,
        text: "You have no completed workouts!"
    }
    let thisDate = new Date(Date.now() - _User.TZOffset * 1000 * 60 * 60);
    let lastworkoutDate = {};
    console.log("thisDate 1: ", thisDate);
    // thisDate.setDate(thisDate.getDate() + 7); //<- for testing
    console.log("thisDate: ", thisDate);
    _User.workoutDates.forEach(function (date, index) {
        if (date.getTime() < thisDate.getTime()
            && date.getDate() <= thisDate.getDate()
            && date.getMonth() <= thisDate.getMonth()
            && date.getYear() <= thisDate.getYear()) {
            console.log(date.getDate(), new Date(Date.now()).getDate());
            let wID = index + 1;
            let relatedWorkout = _User.workouts[wID];
            response = relatedWorkout;
            lastworkoutDate = date;
        }
    })
    if (!response.notFound) {
        response.thisWorkoutDate = lastworkoutDate;
        response.noedits = true;
        response = getVueInfo(response);
        response.noedits = true;
    }
    res.json(response);
    return
});

router.get("/:userId/workouts/last", async function (req, res) {
    console.log("last workout route hit!");
    let _User = await User.findById(req.params.userId);
    let response = {
        notFound: true,
        text: "You have no completed workouts!"
    }
    let thisDate = new Date(Date.now() - _User.TZOffset * 1000 * 60 * 60);
    console.log("thisDate 1: ", thisDate);
    // thisDate.setDate(thisDate.getDate() + 7);
    console.log("thisDate: ", thisDate);
    _User.workoutDates.forEach(function (date, index) {
        if (date.getTime() < thisDate.getTime()
            && date.getDate() <= thisDate.getDate()
            && date.getMonth() <= thisDate.getMonth()
            && date.getYear() <= thisDate.getYear()) {
            console.log(date.getDate(), new Date(Date.now()).getDate());
            let wID = index + 1;
            let relatedWorkout = _User.workouts[wID];
            response = relatedWorkout;
        }
    })
    res.json(response);
    return
});

router.get("/:userId/workouts/:workoutId", async function (req, res) {
    let user = await User.findById(req.params.userId);
    await suggestWeights(user, req.params.workoutId);
    var _Workout = user.workouts[req.params.workoutId];
    res.json(_Workout);
})

router.put("/:userId/workouts/:workoutId/save", async function (req, res) {
    console.log("108 save workout by Id: ", req.body);
    var _User = await User.findById(req.params.userId);
    var body = req.body;
    await saveWorkout(body, _User, req.params.workoutId);
    res.json(req.body);
})


router.put("/:userId/workouts/:workoutId/pattern/:patternId/update", async function (req, res) {
    console.log("UPDATE route hit for set #: ", req.params.patternId);
    console.log("req.body: ", req.body);
    let relatedInputs = {};
    let _User = await User.findById(req.params.userId);
    let _vWID = req.params.workoutId;
    let PNum = req.params.patternId;
    let type = req.body.specialType;
    for (var K in req.body) {
        let kSplit = K.split("|");
        if (kSplit.length > 0 && kSplit[0] == req.params.patternId) {
            relatedInputs[K] = req.body[K];
        }
    }
    console.log("relatedInputs:", relatedInputs);
    if (req.body.saveAlso) {
        await saveWorkout(req.body, _User, req.params.workoutId);
    }
    else {
        await updateSpecial(relatedInputs, _User, _vWID, PNum, type);
    }
    // var axiosPutResponse = await axios.put(`${WorkoutURL}/set/${setNum}/update`, putBody);
    res.json(req.body);
})


// put to "api/user/:userId/change-password"
// in req.body: {oldPassword: "oldPassword", newPassword: "newPassword"}
router.put("/:userId/change-password", async function (req, res) {
    var _User = await User.findById(req.params.userId);
    var oldPassword = req.body.oldPassword;
    var oldPasswordHashed = generateHash(oldPassword, _User.salt);
    if (oldPasswordHashed == _User.password) {
        var newPassword = generateHash(req.body.newPassword, _User.salt);
        _User.password = newPassword;
        await _User.save();
        res.json(_User);
    }
    else {
        res.json({
            error: true,
            status: "Wrong Password",
        });
    }
})

router.post("/:userId/workouts/:workoutId/save", async function (req, res) {
    console.log("128 save workout by Id!!!!");
    var _User = await User.findById(req.params.userId);
    //    console.log("found User?: ", _User);
    var body = req.body;
    await saveWorkout(body, _User, req.params.workoutId);
    res.json(req.body);
})


router.put("/:userId/workouts/:workoutId/submit", async function (req, res) {
    // console.log("108 save workout by Id");
    var _User = await User.findById(req.params.userId);
    var workoutId = req.params.workoutId;
    var body = req.body;
    body.lastWorkout = false;
    // Update user's level-up status every time we 'saveWorkout'   
    await saveWorkout(body, _User, req.params.workoutId, true);
    // Level Up check here -> if last workout
    if (parseInt(workoutId) == _User.workoutDates.length) {
        console.log("SUBMITTING FINAL WORKOUT! \n\n\n");
        console.log("LEVEL CHECK! ", workoutId);
        var levelUpStats = _User.stats["Level Up"];
        // Pre-Level-Up Stats...
        console.log("User level and block num: ", _User.level, _User.blockNum);
        if (_User.level >= 11) {
            // This switches no matter what
            if (_User.blockNum == 1) {
                _User.blockNum = 2;
            }
            else if (_User.blockNum == 2) {
                _User.blockNum = 1;
            }
        }
        if (!levelUpStats.Status.Checked
            && !levelUpStats.Checked
            && levelUpStats.Status.value == 1) {
            _User.level++; //LEVEL-UP HAPPENS HERE
            if (_User.level >= 11) {
                _User.blockNum = 1;
                if (_User.level >= 16) {
                    _User.levelGroup = 4;
                }
                else {
                    _User.levelGroup = 3;
                }
            }
            else {
                if (_User.level >= 6) {
                    _User.levelGroup = 2;
                }
                else {
                    _User.levelGroup = 1;
                }
                _User.blockNum = 0;
            }
        }
        if (levelUpStats.Status.value != 1) {
            _User.stats["Level Up"].Status = Alloy.Failed;
        }
        console.log('_User.stats["Level Up"]: ', _User.stats["Level Up"]);
        _User.stats["Level Up"].Status.Checked = true;
        _User.stats["Level Up"].Checked = true;
        _User.changed('stats', true);
        console.log("POST User level and block num: ", _User.level, _User.blockNum);
        // _User.workoutDates = []; //Added 6/15/2018
        // _User.workouts = {};
        await _User.save();
        body.lastWorkout = true;
    }
    res.json(body);
})

router.put("/:userId/workouts/:workoutId/clear", async function (req, res) {
    console.log("CLEAR ROUTE HIT: ", req.params.userId, req.params.workoutId);
    let _User = await User.findById(req.params.userId);
    let workoutId = req.params.workoutId;
    let thisWorkout = _User.workouts[req.params.workoutId];
    let W = parseInt(thisWorkout.Week);
    let D = parseInt(thisWorkout.Day);
    let level = _User.level;
    let newPatterns = await getblankPatterns(_User.levelGroup, _User.blockNum, W, D, level);
    _User.workouts[req.params.workoutId].Patterns = newPatterns;
    _User.workouts[req.params.workoutId].Completed = false;
    _User.changed('workouts', true);
    await _User.save();
    console.log("newPatterns for: ", req.params.workoutId);
    // let newPatterns = {};
    res.json(newPatterns);
})

let suggestWeights = async function (user, workoutId) {
    let _Workout = user.workouts[workoutId];
    let Patterns = _Workout.Patterns;
    // let newPatterns = {}
    //Add Same-Reps bool check later
    console.log("suggestWeights function: ");
    for (let i = 0; i < Patterns.length; i++) {
        let Pattern = Patterns[i];
        let EType = Pattern.type;
        let relatedStat = user.stats[EType];
        let relatedMax = relatedStat.Max;
        // console.log("relatedStat: ", relatedStat);
        if (Number.isNaN(relatedMax)) {
            continue;
        }
        let minSuggestedWeight = 0;
        let maxSuggestedWeight = 0;
        // gwParams
        Pattern.setList.forEach(set => {
            // console.log("set: ", set);
            let gwParams = set.gwParams;
            let Reps = gwParams.Reps;
            let RPE = gwParams.RPE; //string "decimal", range, or null
            if (Number.isInteger(Reps) && RPE) { //if reps is number and RPE exits (string decimal or null)
                if (set.SuggestedRPE.includes('-')) {
                    let RPERange = set.SuggestedRPE.split('-');
                    let RPE1 = RPERange[0];
                    let RPE2 = RPERange[1];
                    let weight1 = getWeight(relatedMax, set.Reps, RPE1);
                    let weight2 = getWeight(relatedMax, set.Reps, RPE2);
                    minSuggestedWeight = weight1;
                    maxSuggestedWeight = weight2;
                    set.suggestedWeight = weight1 + "-" + weight2;
                    if (weight1 == 0 || weight2 == 0) {
                        set.suggestedWeight = "--";
                    }
                }
                else {
                    set.suggestedWeight = getWeight(relatedMax, set.Reps, set.SuggestedRPE)
                    if (minSuggestedWeight == 0
                        // || set.suggestedWeight < minSuggestedWeight
                    ) {
                        minSuggestedWeight = set.suggestedWeight;
                    }
                    if (maxSuggestedWeight == 0
                        // || set.suggestedWeight > maxSuggestedWeight
                    ) {
                        maxSuggestedWeight = set.suggestedWeight;
                    }
                    if (set.suggestedWeight == 0) {
                        set.suggestedWeight = "--";
                    }
                }
                // console.log("suggestedWeight: ", set.suggestedWeight);
                set.relatedMax = relatedMax;
            }
        });
        if (minSuggestedWeight == 0 || maxSuggestedWeight == 0) {
        }
        else if (minSuggestedWeight == maxSuggestedWeight) {
            Pattern.suggestedWeightString = "Suggested weight: " + minSuggestedWeight + " lbs";
            Pattern.simpleWeightString = minSuggestedWeight + " lbs";
        }
        else {
            Pattern.suggestedWeightString = "Suggested weight: " + minSuggestedWeight + "-" + maxSuggestedWeight + " lbs";
            Pattern.simpleWeightString = minSuggestedWeight + "-" + maxSuggestedWeight + " lbs";
        }
    }
    user.workouts[workoutId].Patterns = Patterns;
    user.changed('workouts', true);
    await user.save();
    // console.log("new Patterns: ", Patterns);
    return
}


router.get("/:userId/workouts/:workoutId/vue", async function (req, res) {
    console.log("req.params.userId:", req.params.userId);
    console.log("req.params.workoutId", req.params.workoutId);
    var thisID = req.params.workoutId;
    if (req.params.workoutId == "0") {
        thisID = '2'; //Test code
    }
    console.log("thisID: ", thisID);
    let thisUser = await User.findById(req.params.userId);
    let userAccess = await accessInfo(thisUser, req.session.timezoneOffset);
    console.log("userAccess: ", userAccess);
    let accessLevel = userAccess.accessLevel;
    let pasthiddenResponse = {
        hidden: true,
        hiddenText: "This workout is no longer accessible!",
        accessLevel
    }
    let futureHiddenResponse = {
        hidden: true,
        hiddenText: "This workout is not accessible yet!",
        accessLevel
    }
    User.findById(req.params.userId).then(async (user) => {
        await suggestWeights(user, req.params.workoutId);
        // console.log("user: ", user);
        // console.log("user.workouts", user.workouts, "thisID", thisID);
        var _Workout = user.workouts[thisID];
        console.log("_Workout: ", _Workout, "thisID", thisID);
        var _WorkoutDate = user.workoutDates[thisID - 1];
        let JSON = _Workout;
        JSON.thisWorkoutDate = _WorkoutDate;
        // console.log("this Workout Date get time: ", _WorkoutDate.getTime());
        // console.log("Date.now: ", Date.now());
        // console.log("> Comparison: ", _WorkoutDate.getTime() > Date.now());
        let ahead = _WorkoutDate.getTime() > Date.now();
        let timeDiff = Math.abs(_WorkoutDate.getTime() - Date.now());
        let daysDiff = new Date(timeDiff).getDate();
        daysDiff = timeDiff / (1000 * 60 * 60 * 24);
        let monthDiff = new Date(timeDiff).getMonth();
        console.log("monthDiff: ", monthDiff, "daysDiff: ", daysDiff, "current time: ", new Date(Date.now()));
        console.log("timezone1: ", _WorkoutDate.getTimezoneOffset(), "timezone2: ", new Date(Date.now()).getTimezoneOffset());

        let todayDate = moment().local();
        todayDate = todayDate.format('YYYY-MM-DD');

        let checkDate = moment(_WorkoutDate).format('YYYY-MM-DD');
        console.log("todayDate: ", todayDate, " checkDate: ", checkDate);
        if (accessLevel < 4) {
            // res.json({
            // noAccess: true,
            // accessLevel,
            // })
            // return
        }
        // console.log("time difference: ", timeDiff);
        // console.log("N Days: ", new Date(timeDiff).getDate());
        if (ahead && daysDiff > 30 && !user.isAdmin) {
            res.json(futureHiddenResponse);
            return
        }
        else if (!ahead && daysDiff > 30 && !user.isAdmin) {
            res.json(pasthiddenResponse);
            return
        }
        let accessible = false;
        // if (monthDiff == 0 && daysDiff == 0) {
        //     accessible = true;
        // }
        // else {
        //     accessible = false;            
        // }
        let editable = false;
        let noedits = false;

        if (todayDate == checkDate) {
            accessible = true;
        }
        else {
            accessible = false;
        }
        JSON.accessible = accessible;

        editable = !(JSON.Completed) && JSON.accessible;
        // noedits = JSON.completed || !(JSON.accessible);
        noedits = JSON.Completed;
        let userAccess = await accessInfo(user, req.session.timezoneOffset);
        if (userAccess.accessLevel < 6) {
            editable = false;
            noedits = true;
        }
        // if ()
        JSON.editable = editable;
        JSON.noedits = noedits;
        let workoutDatelist = [];
        var userWorkouts = user.workouts;

        let Now = new Date(Date.now() - user.TZOffset * 1000 * 60 * 60);
        console.log('_WorkoutDate: ', _WorkoutDate);
        console.log('Now: ', Now);
        if (user.isAdmin) {
            editable = true;
            noedits = false;
        }
        else if (_WorkoutDate.getDate() != Now.getDate()
            || _WorkoutDate.getMonth() != Now.getMonth()
            || _WorkoutDate.getYear() != Now.getYear()
            || JSON.Completed) {
            noedits = true;
            editable = false;
        }
        JSON.noedits = noedits;
        console.log('\n\n noedits & editable: ', noedits, editable);
        var vueJSON = getVueInfo(JSON);
        console.log('getVueInfo just got called (line 1092)');
        vueJSON.accessible = accessible;
        vueJSON.noedits = noedits;

        for (var K in userWorkouts) {
            var Workout = userWorkouts[K];
            if (!Workout.ID) {
                continue;
            }
            var _W = Workout.Week;
            var _D = Workout.Day;
            var wID = Workout.ID;
            // var date = G_UserInfo["User"].workoutDates[wID - 1];
            var date = dateString(user.workoutDates[wID - 1]);
            // console.log("date", date, _W, _D, K);
            workoutDatelist.push({ Week: _W, Day: _D, Date: date, ID: wID });
        }
        // vueJSON.accessLevel = 
        vueJSON.workoutDates = workoutDatelist;
        vueJSON.accessLevel = accessLevel;
        console.log("vueJSON.accessLevel: ", vueJSON.accessLevel);
        res.json(vueJSON);
    });
})


router.put("/:userId", function (req, res) {
    User.findById(req.params.userId).then((user) => {
        user.update(req.body).then(user => res.json(user));
    });
})

router.get("/:userId/stats", function (req, res) {
    User.findById(req.params.userId).then((user) => {
        res.json(user.stats);
    })
})

router.put("/:userId/stats", function (req, res) {
    User.findById(req.params.userId).then((user) => {
        user.update(
            {
                stats: req.body,
            }
        ).then(user => res.json(user));
    });
})

router.get('/:userId/profile-info/', async function (req, res) {
    let _User = await User.findById(req.params.userId);
    let userAccess = await accessInfo(_User, req.session.timezoneOffset);

    let profileBody = {
        username: _User.username,
        level: _User.level,
        blockNum: _User.blockNum,
        accessLevel: userAccess.accessLevel,
    };
    var nWorkoutsComplete = 0;
    var nWorkouts = 0;
    for (var K in _User.workouts) {
        if (_User.workouts[K].Completed) {
            nWorkoutsComplete++;
        }
        nWorkouts++;
    }
    var percentComplete = Math.round((nWorkoutsComplete * 100) / (nWorkouts));
    if (nWorkouts == 0) {
        percentComplete = 0;
    }
    profileBody.percentComplete = percentComplete;
    profileBody.progressText = percentComplete + " % (" + nWorkoutsComplete + "/" + nWorkouts + " complete)";
    res.json(profileBody);
})

router.get('/:userId/stats/vue/get', function (req, res) {
    var userId = req.params.userId;
    User.findById(userId).then(async (user) => {
        var JSONStats = user.stats;
        for (var statKey in JSONStats) {
            console.log(statKey);
        }
        await correctStatNames(user, user.level);
        console.log(JSONStats);
        // res.json(user.workouts);
        var nWorkoutsComplete = 0;
        var nWorkouts = 0;
        for (var K in user.workouts) {
            if (user.workouts[K].Completed) {
                nWorkoutsComplete++;
            }
            nWorkouts++;
        }
        // user.
        var percentComplete = Math.round((nWorkoutsComplete * 100) / (nWorkouts));
        var vueData = {
            level: user.level,
            blockNum: user.blockNum,
            exerciseTableItems: vueStats(JSONStats),
            nPassed: 0,
            nFailed: 0,
            nTesting: 0,
            nWorkoutsComplete: nWorkoutsComplete,
            nWorkouts: nWorkouts,
            percentComplete,
        }
        vueData.exerciseTableItems.forEach(stat => {
            if (stat.alloyVal == 1) {
                vueData.nPassed++;
            }
            else if (stat.alloyVal == -1) {
                vueData.nFailed++;
            }
            else {
                vueData.nTesting++;
            }
        })
        let userAccess = await accessInfo(user, req.session.timezoneOffset);
        vueData.accessLevel = userAccess.accessLevel;
        res.json(vueData);
    })
})

async function correctStatNames(user, useLevel) {
    for (var K in user.stats) {
        let EType = K;
        if (EType != "Level Up") {
            user.stats[EType].Name = ExercisesJSON.Exercises[EType][useLevel].name;
        }
    }
    await user.changed('stats', true);
    await user.save();
    return true;
}

router.get('/:userId/progress/vue/get', async function (req, res) {
    var userId = req.params.userId;
    User.findById(userId).then(async user => {
        var JSONStats = user.stats;
        var vueData = vueProgress(JSONStats);
        vueData.newLevel = user.level;
        vueData.oldLevel = (vueData.levelUpVal == 1) ? user.level - 1 : user.level;
        if (vueData.oldLevel <= 0) {
            vueData.oldLevel = 1;
        }
        await correctStatNames(user, vueData.oldLevel);
        vueData.nPassed = 0;
        vueData.nFailed = 0;
        vueData.nTesting = 0;
        vueData.levelUpMessage = "";
        vueData.levelUpImage = "";
        vueData.blockNum = user.blockNum;
        if (user.level == 6) {
            vueData.levelUpMessage = LevelUpMesssages[6];
        }
        else if (user.level == 11) {
            vueData.levelUpMessage = LevelUpMesssages[11];
        }
        else if (user.level == 16) {
            vueData.levelUpMessage = LevelUpMesssages[16];
        }

        if (vueData.levelUpVal == 1) {
            vueData.statusText = "You have PASSED Level " + vueData.oldLevel;
        }
        else if (vueData.levelUpVal == -1) {
            vueData.statusText = "You have FAILED Level " + vueData.oldLevel;
        }
        else {
            vueData.statusText = "Still In Progress";
        }
        if (vueData.oldLevel >= 11 && user.blockNum == 2) {
            vueData.statusText = `You have COMPLETED Level ${vueData.oldLevel} - Block 1`;
        }
        vueData.coreExerciseTableItems.forEach(stat => {
            if (stat.alloyVal == 1) {
                vueData.nPassed++;
            }
            else if (stat.alloyVal == -1) {
                vueData.nFailed++;
            }
            else {
                vueData.nTesting++;
            }
        })
        vueData.secondaryExerciseTableItems.forEach(stat => {
            if (stat.alloyVal == 1) {
                vueData.nPassed++;
            }
            else if (stat.alloyVal == -1) {
                vueData.nFailed++;
            }
            else {
                vueData.nTesting++;
            }
        })
        let userAccess = await accessInfo(user, req.session.timezoneOffset);
        vueData.accessLevel = userAccess.accessLevel;
        res.json(vueData);
    })
})


router.put("/:userId/workouts", function (req, res) {
    User.findById(req.params.userId).then((user) => {
        user.update(
            {
                workouts: req.body,
            }
        ).then(user => res.json(user));
    });
})

router.post("/:userId/oldstats", function (req, res) {
    User.findById(req.params.userId).then((user) => {
        user.oldstats.push(req.body);
        user.changed('oldstats', true);
        user.save().then(user => res.json(user));
    });
})

// let {squatWeight, benchWeight, RPEExp, bodyWeight} = input; 
router.put("/:userId/get-level", async function (req, res) {
    console.log('get-level-route: ', req.body);
    var _User = await User.findById(req.params.userId);
    var input = req.body;
    await assignLevel(_User, input);
    if (_User.level == 11) {
        _User.blockNum = 1;
    }
    await _User.save();
    console.log('assigned level + blockNum: ', _User.level, _User.blockNum);
    res.json(
        {
            user: _User,
            viewingWID: 1
        });
    return
})

router.put("/:userId/generate-workouts", async function (req, res) {
    console.log("put to generate-workouts (line 408): ");
    var input = req.body;
    var _User = await User.findById(req.params.userId);
    if (_User.workoutDates.length > 0) {
        var _oldStat = {
            finishDate: _User.workoutDates[-1],
            level: _User.level,
        };
        _oldStat.statDict = _User.stats
        _User.oldstats.push(_oldStat);
        _User.changed('oldstats', true);
        await _User.save();
    }
    if (_User.level >= 11) {
        _User.blockNum = parseInt(req.body.blockNum);
        if (_User.level >= 16) {
            _User.levelGroup = 4;
        }
        else {
            _User.levelGroup = 3;
        }
    }
    else {
        if (_User.level >= 6) {
            _User.levelGroup = 2;
        }
        else {
            _User.levelGroup = 1;
        }
        _User.blockNum = 0;
    }
    await _User.save();
    let stringDate = false;
    let startDate = "";
    if (input.startDate) { //will autoconvert startdate
        startDate = input.startDate;
        stringDate = true;
    }
    else {
        startDate = input.formattedDate;
        stringDate = false;
    }
    let daysList = [
        parseInt(input["Day-1"]),
        parseInt(input["Day-2"]),
        parseInt(input["Day-3"]),
    ];
    await generateWorkouts(_User, startDate, daysList, stringDate);
    //Formerly used assignWorkouts(_User, input)
    await _User.save();
    res.json({
        input, updatedUser: _User, session: {
            viewingWID: 1,
            User: _User,
            username: _User.username,
            userId: _User.id,
        }
    });
    return
});

router.post("/:userId/get-next-workouts", async function (req, res) {
    console.log("posting to get-next-workouts (line 432): ");
    // console.log("userId: ", req.params.userId);
    var _User = await User.findById(req.params.userId);
    var input = req.body;
    console.log("input.workoutLevel: ", input.workoutLevel)
    input.userId = req.params.userId;
    // console.log("91", input);
    _User.oldstats = [];
    _User.oldworkouts = [];
    await _User.save();
    if (_User.workoutDates.length > 0) {
        var lastWDate = _User.workoutDates[_User.workoutDates.length - 1];
        console.log("last workout date in list: ", _User.workoutDates[_User.workoutDates.length - 1]);
        var _oldStat = {
            finishDate: lastWDate,
            level: _User.level,
        };
        var _oldWorkouts = _User.workouts;
        _oldStat.statDict = _User.stats
        _User.oldstats.push(_oldStat);
        _User.oldworkouts.push(_oldWorkouts);
        _User.changed('oldstats', true);
        _User.changed('oldworkouts', true);
        await _User.save();
    }
    if (input.workoutLevel != '') {
        _User.level = parseInt(input.workoutLevel);
        console.log("line 481, user.level: ", _User.level);
        if (_User.level >= 11) {
            _User.blockNum = parseInt(req.body.workoutBlock);
            if (_User.level >= 16) {
                _User.levelGroup = 4;
            }
            else {
                _User.levelGroup = 3;
            }
        }
        else {
            if (_User.level >= 6) {
                _User.levelGroup = 2;
            }
            else {
                _User.levelGroup = 1;
            }
            _User.blockNum = 0;
        }
        await _User.save();
    }
    console.log("line 501");
    let stringDate = false;
    let startDate = "";
    if (input.startDate) { //will autoconvert startdate
        startDate = input.startDate;
        stringDate = true;
    }
    else {
        startDate = input.formattedDate;
        stringDate = false;
    }
    let daysList = [
        parseInt(input["Day-1"]),
        parseInt(input["Day-2"]),
        parseInt(input["Day-3"]),
    ];
    await generateWorkouts(_User, startDate, daysList, stringDate);
    // Formerly used await assignWorkouts(_User, input);        
    await _User.save();

    res.json({
        input, updatedUser: _User, session: {
            viewingWID: 1,
            User: _User,
            username: _User.username,
            userId: _User.id,
        }
    });
    // res.send("test");
    return
})

// admin set-level post info:
// {
// startDate: "YYYY-MM-DD",
// daysList: [1, 3, 5],
// newLevel: 18,
// }
// Admins can set their level
router.post("/:userId/admin/generate-workouts", async function (req, res) {
    console.log("ADMIN GENERATE WORKOUTS: (LINE 457)");
    // console.log("req.body: ", req.body);
    console.log("startDate: ", req.body.startDate);
    var _User = await User.findById(req.params.userId);
    if (_User.workoutDates.length > 0) {
        var lastWDate = _User.workoutDates[_User.workoutDates.length - 1];
        console.log("last workout date in list: ", _User.workoutDates[_User.workoutDates.length - 1]);
        var _oldStat = {
            finishDate: lastWDate,
            level: _User.level,
        };
        var _oldWorkouts = _User.workouts;
        _oldStat.statDict = _User.stats
        _User.oldstats.push(_oldStat);
        _User.oldworkouts.push(_oldWorkouts);
        _User.changed('oldstats', true);
        _User.changed('oldworkouts', true);
        await _User.save();
    }
    if (req.body.newLevel) {
        _User.level = parseInt(req.body.newLevel);
        await _User.save();
    }

    if (_User.level >= 11) {
        if (_User.blockNum == 0) {
            _User.blockNum = 1;
        }
        if (req.body.blockNum) {
            _User.blockNum = parseInt(req.body.blockNum);
        }
        if (_User.level >= 16) {
            _User.levelGroup = 4;
        }
        else {
            _User.levelGroup = 3;
        }
    }
    else {
        if (_User.level >= 6) {
            _User.levelGroup = 2;
        }
        else {
            _User.levelGroup = 1;
        }
        _User.blockNum = 0;
    }
    console.log('USER.LEVEL, BLOCKNUM: ', _User.level, _User.blockNum);
    await _User.save();
    var stringDate = false;
    if (req.body.stringDate) {
        stringDate = true;
    }
    let startDate = req.body.startDate;
    let daysList = req.body.daysList;
    var output = await generateWorkouts(_User, startDate, daysList, true);
    // res.json(output);
    res.json(_User);
});

router.post(":/userId/set-level", async function (req, res) {
    var newLevel = parseInt(req.body.level);
    var user = await User.findById(req.params.userId);
    user.level = newLevel;
    await user.save();
    res.json(user);
})


router.post("/:userId/old-stats/clear", async function (req, res) {

})

router.get("/:userId/videos", async function (req, res) {
    var videosUser = await User.findById(req.params.userId);
    let userAccess = await accessInfo(videosUser, req.session.timezoneOffset);
    console.log('videosVue 1: ');
    var videos = VideosVue(VideosJSON, videosUser.level);
    // console.log('videosVue 2: ');
    // let _videos = VideosVue(LevelVideos, videosUser.level);
    // videos.videoList = videos.videoList.concat(_videos.videoList);

    videos.accessLevel = userAccess.accessLevel;
    res.json(videos);
})



module.exports = router;