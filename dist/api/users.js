'use strict';

var _expressSession = require('express-session');

var _expressSession2 = _interopRequireDefault(_expressSession);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _stripeFunctions = require('./apiFunctions/stripeFunctions');

var _userFunctions = require('./apiFunctions/userFunctions');

var _workoutFunctions = require('./apiFunctions/workoutFunctions');

var _workoutUpdate = require('./apiFunctions/workoutUpdate');

var _generateWorkouts = require('./apiFunctions/generateWorkouts');

var _vueFormat = require('./vueFormat');

var _levelupMessages = require('../content/levelupMessages');

var _models = require('../models');

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _data = require('../data');

var _data2 = _interopRequireDefault(_data);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const session = require('express-session');
var bodyParser = require('body-parser');
var express = require('express');
var bcrypt = require('bcryptjs');

var router = express.Router();

var stripe = require("stripe")('sk_test_LKsnEFYm74fwmLbyfR3qKWgb');

// var models = require('../models');
// 	var Exercise = models.Exercise;
// 	var WorkoutTemplate = models.WorkoutTemplate;
// 	var SubWorkoutTemplate = models.SubWorkoutTemplate;
// 	var Workout = models.Workout;
// 	var User = models.User;

// let data = require('../data');

var W3a = _data2.default.AllWorkouts[3]["a"];
var RPETable = _data2.default.RPETable;
var Exercises = _data2.default.ExerciseDict;
var VideosJSON = _data2.default.VideosJSON;
var VideosVue = _data2.default.VideosVue;
var DescriptionsJSON = _data2.default.DescriptionsJSON;
var allWorkoutJSONs = _data2.default.AllWorkouts;

var globalFuncs = require('../globals/functions');
var getMax = globalFuncs.getMax;
var getWeight = globalFuncs.getWeight;
var getWorkoutDates = globalFuncs.getWorkoutDays;
var G_getPattern = globalFuncs.getPattern;
var dateString = globalFuncs.dateString;

var globalEnums = require('../globals/enums');
var DaysofWeekDict = globalEnums.DaysofWeekDict;
var Alloy = globalEnums.Alloy;
// Move below to apiFunctions later under workoutFunctions 
var workoutHandlers = require('../routes/workoutHandlers');
var saveWorkout = workoutHandlers.saveWorkout;

var vueAPI = require('../routes/vueAPI');
var getVueInfo = vueAPI.getVueInfo;

router.get("/", function (req, res) {
    req.session.set = true;
    _models.User.findAll({
        where: {}
    }).then(function (users) {
        res.json(users);
    });
});

// Inputs: email, name, 
router.post("/", async function (req, res) {
    var newUser = await (0, _userFunctions.signupUser)(req.body);
    if (newUser == false) {
        res.json({
            error: true,
            status: "passwords no match"
        });
        return;
    } else {
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
});

// On change subscription: 
//cancel_at_period_end = true;
//create new subscription with billing_cycle_anchor at period_end
// Plan IDs: AS_Bronze, AS_Silver, AS_Gold
// req.body: newPlanID, cancel (bool)
router.put('/:id/change-subscription', async function (req, res) {
    var user = await _models.User.findById(req.params.id);
    console.log("changing subscription for user: ", user.username);
    var newPlanID = req.body.newPlanID;
    var stripeUser = await stripe.customers.retrieve(user.stripeId);
    var subscriptions = stripeUser.subscriptions;
    var subscriptionId = "";
    var currentSubscription = {};
    if (subscriptions.data.length > 0) {
        var nSubs = subscriptions.data.length;
        subscriptionId = subscriptions.data[0].id;
        currentSubscription = subscriptions.data[0];
    }

    if (req.body.cancel) {
        var cancelSubscription = await stripe.subscriptions.del(subscriptionId, {
            at_period_end: true
        });
        // let updatedSubscription = await stripe.subscriptions.retrieve(user.stripeId);
        res.json(cancelSubscription);
        return;
    } else {
        await stripe.subscriptions.update(subscriptionId, {
            cancel_at_period_end: true
        });
        if (currentSubscription.status == 'trialing') {
            await stripe.subscriptions.del(subscriptionId);
        }
        var newSubscription = await stripe.subscriptions.create({
            customer: user.stripeId,
            billing_cycle_anchor: currentSubscription.current_period_end,
            trial_end: currentSubscription.current_period_end,
            items: [{
                plan: req.body.newPlanID
            }]
        });
        res.json(newSubscription);
        return;
    }
    // let 
});

router.get('/:id/active-subscription', async function (req, res) {
    var user = await _models.User.findById(req.params.id);
    var stripeUser = await stripe.customers.retrieve(user.stripeId);
    var subscriptionsList = stripeUser.subscriptions.data;
    subscriptionsList.forEach(function (sub) {
        if (sub.status == 'active') {
            res.json(sub);
            return;
        }
    });
    res.json({
        noActiveSubscriptions: true
    });
});

router.get('/:id/active-subscription-info', async function (req, res) {
    var user = await _models.User.findById(req.params.id);
    var stripeUser = await stripe.customers.retrieve(user.stripeId);
    var subscriptionsList = stripeUser.subscriptions.data;
    subscriptionsList.forEach(function (sub) {
        if (sub.status == 'active') {
            res.json((0, _stripeFunctions.getSubscriptionInfo)(sub));
            return;
        }
    });
    res.json({
        noActiveSubscriptions: true
    });
});

router.get('/:id/first-subscription', async function (req, res) {
    var user = await _models.User.findById(req.params.id);
    var stripeUser = await stripe.customers.retrieve(user.stripeId);
    var subscriptions = stripeUser.subscriptions;
    if (subscriptions.data.length > 0) {
        res.json(subscriptions.data[0]);
        return;
    } else {
        res.json({
            noSubscriptions: true
        });
        return;
    }
});

router.get('/:id/first-subscription-info', async function (req, res) {
    console.log("line 154 users.js");
    var user = await _models.User.findById(req.params.id);
    var stripeUser = await stripe.customers.retrieve(user.stripeId);
    var subscriptions = stripeUser.subscriptions;
    if (subscriptions.data.length > 0) {
        var current = subscriptions.data[0];
        var information = (0, _stripeFunctions.getSubscriptionInfo)(current);
        res.json(information);
        return;
    } else {
        res.json({
            noSubscriptions: true
        });
        return;
    }
});

//0 index is most recent
router.get('/:id/subscription-info', async function (req, res) {
    var user = await _models.User.findById(req.params.id);
    var stripeUser = await stripe.customers.retrieve(user.stripeId);
    var subscriptionList = stripeUser.subscriptions.data;
    var firstSubscription = subscriptionList[0];
    var firstActiveSubscription = {};
    var subscriptionDescriber = "";
    var currentPlan = "";
    var endDateString = "";
    var nextPlan = false;
    var secondLine = "";

    // if (subscriptionStatus == 'trialing' || subscriptionStatus == 'active') {
    //     subscriptionValid = true;
    // }

    for (var i = 0; i < subscriptionList.length; i++) {
        var thisSub = subscriptionList[i];
        if (thisSub.status == 'active') {
            firstActiveSubscription = thisSub;
            currentPlan = firstActiveSubscription.plan.nickname;
            var endDate = new Date(firstActiveSubscription.current_period_end * 1000);
            endDateString = dateString(endDate);
            subscriptionDescriber = 'Your current subscription is ' + currentPlan + ' ' + ('and lasts until ' + endDateString + '.');
            break;
        }
    }
    if (firstSubscription.status == 'trialing') {
        nextPlan = firstSubscription.plan.nickname;
        subscriptionDescriber += ' It will change to ' + nextPlan + ' on this date.';
        secondLine = ' It will change to ' + nextPlan + ' on this date.';
    } else if (firstSubscription.cancel_at_period_end) {
        subscriptionDescriber += ' It has been cancelled and will expire after this date.';
        secondLine = ' It has been cancelled and will expire after this date.';
    } else if (firstSubscription.status == 'active') {
        subscriptionDescriber += ' It will renew automatically.';
        secondLine = ' It will renew automatically.';
    }

    res.json({
        describer: subscriptionDescriber,
        currentPlan: currentPlan,
        endDateString: endDateString,
        nextPlan: nextPlan,
        secondLine: secondLine
    });
});

//0 index is most recent
router.get('/:id/all-subscriptions', async function (req, res) {
    var user = await _models.User.findById(req.params.id);
    try {
        var stripeUser = await stripe.customers.retrieve(user.stripeId);
        res.json(stripeUser.subscriptions.data);
    } catch (error) {
        error.Error = true;
        res.json(error);
    }
});

router.get('/:id/all-subscriptions-info', async function (req, res) {
    var user = await _models.User.findById(req.params.id);
    try {
        var stripeUser = await stripe.customers.retrieve(user.stripeId);
        var subscriptions = stripeUser.subscriptions.data;
        var subscriptionInfo = [];
        subscriptions.forEach(function (sub) {
            var information = (0, _stripeFunctions.getSubscriptionInfo)(sub);
            subscriptionInfo.push(information);
            // console.log("customer subscription information: ", information);
        });
        res.json(subscriptionInfo);
    } catch (error) {
        error.Error = true;
        res.json(error);
    }
});

// Plan ID: AS_Bronze, AS_Silver, AS_Gold
router.post('/:id/subscribe', async function (req, res) {
    var stripeToken = req.body.stripeToken;
    var planID = req.body.planID;

    console.log("req.body (api/users): ", req.body);
    var user = await _models.User.findById(req.params.id);
    var stripeUser = await stripe.customers.create({
        source: stripeToken,
        email: user.username
    });
    var newStripeId = stripeUser.id;
    user.stripeId = newStripeId;
    await user.save();
    var newSubscription = await stripe.subscriptions.create({
        customer: stripeUser.id,
        items: [{
            plan: "AS_Silver"
        }]
    });
    res.json(findCustomer);
    var findCustomer = await stripe.customers.retrieve(stripeUser.id);
    console.log("customer found: ", findCustomer);
    return;
});

router.get('/:id/reschedule-workouts', async function (req, res) {
    var user = await _models.User.findById(req.params.id);
    var Now = new Date(Date.now());
    var workouts = [];
    for (var K in user.workouts) {
        var W = user.workouts[K];
        var wDate = new Date(W.Date);
        var workoutObj = {
            Week: W.Week,
            Day: W.Day,
            Date: wDate,
            Missed: false,
            Completed: false
        };
        if (W.Completed) {
            workoutObj.Completed = true;
        } else {
            //If incomplete and less than now
            if ( //Check if date is less than Now
            wDate && wDate.getDate() < Now.getDate() && wDate.getMonth() <= Now.getMonth()) {
                workoutObj.Missed = true;
            }
        }
        workouts.push(workoutObj);
    }
    res.json(workouts);
});

router.post('/:id/reschedule-workouts', async function (req, res) {
    console.log("posting to reschedule... from users api");
    console.log("req.body: ", req.body);
    // console.log("new start date: ", new Date(req.body.restartDate));
    var newStartDate = new Date(req.body.restartDate);
    var Now = new Date(Date.now());
    console.log("/:id/reschedule-workouts route ");
    console.log("   Now: ", Now);
    console.log("   newStartDate ", newStartDate);
    var user = await _models.User.findById(req.params.id);
    if ('DoW' in req.body) {
        var DoWArray = [];
        req.body.DoW.forEach(function (day) {
            DoWArray.push(parseInt(day));
        });
        // console.log('old workout dates: ', user.workoutDates);
        var newDates = await (0, _workoutFunctions.rescheduleWorkouts)(user, newStartDate, DoWArray);
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
    res.redirect('/reschedule');
});

router.post('/:id/payment', async function (req, res) {});

router.post("/:username/login", async function (req, res) {
    var username = req.params.username;
    var passwordInput = req.body.password;
    var Now = new Date(Date.now());
    console.log("username/login route hit", req.body);
    var loginUser = await _models.User.findOne({
        where: {
            username: username
        }
    });

    if (!loginUser) {
        res.json({
            Success: false,
            Found: false,
            Status: "No user found"
        });
    } else {
        var hashed = _models.User.generateHash(passwordInput, loginUser.salt);
        if (hashed == loginUser.password) {
            var hasWorkouts = Object.keys(loginUser.workouts).length > 0;
            loginUser.missedWorkouts = false;
            for (var K in loginUser.workouts) {
                var W = loginUser.workouts[K];
                var wDate = new Date(W.Date);
                if (
                //If there's an incomplete workout before the current date
                !W.Completed && wDate && wDate.getDate() < Now.getDate() && wDate.getMonth() <= Now.getMonth()) {
                    loginUser.missedWorkouts = true;
                }
            }
            var hasSubscription = false;
            var subscriptionValid = false;
            var subscriptionStatus = false;
            if (loginUser.stripeId != "") {
                var stripeUser = await stripe.customers.retrieve(loginuser.stripeId);
                if (stripeUser.subscriptions.data.length > 0) {
                    hasSubscription = true;
                    subscriptionStatus = stripeUser.subscriptions.data[0].status;
                    if (subscriptionStatus == 'trialing' || subscriptionStatus == 'active') {
                        subscriptionValid = true;
                    }
                }
            }
            res.json({
                Success: true,
                Found: true,
                Status: "Success",
                User: loginUser,
                hasWorkouts: hasWorkouts,
                subscriptionValid: subscriptionValid,
                hasSubscription: hasSubscription,
                subscriptionStatus: subscriptionStatus
            });
        } else {
            res.json({
                Success: false,
                Found: true,
                Status: "Incorrect Password!"
            });
        }
    }
});

router.get("/:userId", async function (req, res) {
    var user = await _models.User.findById(req.params.userId);
    res.json(user);
});

router.delete('/:userId/stripe', async function (req, res) {
    var user = await _models.User.findById(req.params.userId);
    try {
        var deletion = await stripe.customers.del(user.stripeId);
        res.json(deletion);
    } catch (error) {
        res.json(error);
    }
});

router.get("/:userId/access-info", async function (req, res) {
    var user = await _models.User.findById(req.params.userId);
    var response = Object.assign({}, user);
    var Now = new Date(Date.now());
    // Workouts
    var hasLevel = true; //send to enter stats page
    // let 
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
    res.json({
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
    });
});

router.get("/:userId/workouts", function (req, res) {
    _models.User.findById(req.params.userId).then(function (user) {
        res.json(user.workouts);
    });
});

router.get("/:userId/last-workout", async function (req, res) {
    console.log("last-workout route hit!");
    var _User = await _models.User.findById(req.params.userId);
    var response = {
        notFound: true,
        text: "You have no completed workouts!"
    };
    var thisDate = new Date(Date.now());
    console.log("thisDate 1: ", thisDate);
    // thisDate.setDate(thisDate.getDate() + 7);
    console.log("thisDate: ", thisDate);
    _User.workoutDates.forEach(function (date, index) {
        if (date.getTime() < thisDate.getTime() && date.getDate() < thisDate.getDate()) {
            console.log(date.getDate(), new Date(Date.now()).getDate());
            var wID = index + 1;
            var relatedWorkout = _User.workouts[wID];
            response = relatedWorkout;
        }
    });
    res.json(response);
    return;
});

router.get("/:userId/last-workout/vue", async function (req, res) {
    console.log("last-workout route hit!");
    var _User = await _models.User.findById(req.params.userId);
    var response = {
        notFound: true,
        text: "You have no completed workouts!"
    };
    var thisDate = new Date(Date.now());
    var lastworkoutDate = {};
    console.log("thisDate 1: ", thisDate);
    // thisDate.setDate(thisDate.getDate() + 7); //<- for testing
    console.log("thisDate: ", thisDate);
    _User.workoutDates.forEach(function (date, index) {
        if (date.getTime() < thisDate.getTime() && date.getDate() < thisDate.getDate()) {
            console.log(date.getDate(), new Date(Date.now()).getDate());
            var wID = index + 1;
            var relatedWorkout = _User.workouts[wID];
            response = relatedWorkout;
            lastworkoutDate = date;
        }
    });
    if (!response.notFound) {
        response.thisWorkoutDate = lastworkoutDate;
        response.noedits = true;
        response = getVueInfo(response);
        response.noedits = true;
    }
    res.json(response);
    return;
});

router.get("/:userId/workouts/last", async function (req, res) {
    console.log("last workout route hit!");
    var _User = await _models.User.findById(req.params.userId);
    var response = {
        notFound: true,
        text: "You have no completed workouts!"
    };
    var thisDate = new Date(Date.now());
    console.log("thisDate 1: ", thisDate);
    // thisDate.setDate(thisDate.getDate() + 7);
    console.log("thisDate: ", thisDate);
    _User.workoutDates.forEach(function (date, index) {
        if (date.getTime() < thisDate.getTime() && date.getDate() < thisDate.getDate()) {
            console.log(date.getDate(), new Date(Date.now()).getDate());
            var wID = index + 1;
            var relatedWorkout = _User.workouts[wID];
            response = relatedWorkout;
        }
    });
    res.json(response);
    return;
});

router.get("/:userId/workouts/:workoutId", async function (req, res) {
    var user = await _models.User.findById(req.params.userId);
    await suggestWeights(user, req.params.workoutId);
    var _Workout = user.workouts[req.params.workoutId];
    res.json(_Workout);
});

router.put("/:userId/workouts/:workoutId/save", async function (req, res) {
    console.log("108 save workout by Id: ", req.body);
    var _User = await _models.User.findById(req.params.userId);
    var body = req.body;
    await saveWorkout(body, _User, req.params.workoutId);
    res.json(req.body);
});

router.put("/:userId/workouts/:workoutId/pattern/:patternId/update", async function (req, res) {
    console.log("UPDATE route hit for set #: ", req.params.patternId);
    console.log("req.body: ", req.body);
    var relatedInputs = {};
    var _User = await _models.User.findById(req.params.userId);
    var _vWID = req.params.workoutId;
    var PNum = req.params.patternId;
    var type = req.body.specialType;
    for (var K in req.body) {
        var kSplit = K.split("|");
        if (kSplit.length > 0 && kSplit[0] == req.params.patternId) {
            relatedInputs[K] = req.body[K];
        }
    }
    console.log("relatedInputs:", relatedInputs);
    if (req.body.saveAlso) {
        await saveWorkout(req.body, _User, req.params.workoutId);
    } else {
        await (0, _workoutUpdate.updateSpecial)(relatedInputs, _User, _vWID, PNum, type);
    }
    // var axiosPutResponse = await axios.put(`${WorkoutURL}/set/${setNum}/update`, putBody);
    res.json(req.body);
});

// put to "api/user/:userId/change-password"
// in req.body: {oldPassword: "oldPassword", newPassword: "newPassword"}
router.put("/:userId/change-password", async function (req, res) {
    var _User = await _models.User.findById(req.params.userId);
    var oldPassword = req.body.oldPassword;
    var oldPasswordHashed = (0, _userFunctions.generateHash)(oldPassword, _User.salt);
    if (oldPasswordHashed == _User.password) {
        var newPassword = (0, _userFunctions.generateHash)(req.body.newPassword, _User.salt);
        _User.password = newPassword;
        await _User.save();
        res.json(_User);
    } else {
        res.json({
            error: true,
            status: "Wrong Password"
        });
    }
});

router.post("/:userId/workouts/:workoutId/save", async function (req, res) {
    console.log("128 save workout by Id!!!!");
    var _User = await _models.User.findById(req.params.userId);
    //    console.log("found User?: ", _User);
    var body = req.body;
    await saveWorkout(body, _User, req.params.workoutId);
    res.json(req.body);
});

router.put("/:userId/workouts/:workoutId/submit", async function (req, res) {
    // console.log("108 save workout by Id");
    var _User = await _models.User.findById(req.params.userId);
    var workoutId = req.params.workoutId;
    var body = req.body;
    body.lastWorkout = false;
    await saveWorkout(body, _User, req.params.workoutId, true);
    if (parseInt(workoutId) == _User.workoutDates.length) {
        console.log("LEVEL CHECK! ", workoutId);
        var levelUpStats = _User.stats["Level Up"];
        if (_User.level >= 11 && _User.blockNum == 1) {
            _User.blockNum = 2;
        } else if (!levelUpStats.Status.Checked && levelUpStats.Status.value == 1) {
            _User.level++;
            if (_User.level >= 11) {
                if (_User.level >= 16) {
                    _User.levelGroup = 4;
                } else {
                    _User.levelGroup = 3;
                }
            } else {
                if (_User.level >= 6) {
                    _User.levelGroup = 2;
                } else {
                    _User.levelGroup = 1;
                }
                _User.blockNum = 0;
            }
        }
        _User.stats["Level Up"].Status.Checked = true;
        _User.changed('stats', true);
        await _User.save();
        body.lastWorkout = true;
    }
    res.json(body);
});

router.put("/:userId/workouts/:workoutId/clear", async function (req, res) {
    console.log("CLEAR ROUTE HIT: ", req.params.userId, req.params.workoutId);
    var _User = await _models.User.findById(req.params.userId);
    var workoutId = req.params.workoutId;
    var thisWorkout = _User.workouts[req.params.workoutId];
    var W = parseInt(thisWorkout.Week);
    var D = parseInt(thisWorkout.Day);
    var level = _User.level;
    var newPatterns = await (0, _workoutFunctions.getblankPatterns)(_User.levelGroup, _User.blockNum, W, D, level);
    _User.workouts[req.params.workoutId].Patterns = newPatterns;
    _User.changed('workouts', true);
    await _User.save();
    console.log("newPatterns for: ", newPatterns.number);
    // let newPatterns = {};
    res.json(newPatterns);
});

var suggestWeights = async function suggestWeights(user, workoutId) {
    var _Workout = user.workouts[workoutId];
    var Patterns = _Workout.Patterns;
    // let newPatterns = {}
    //Add Same-Reps bool check later
    console.log("suggestWeights function: ");

    var _loop = function _loop(i) {
        var Pattern = Patterns[i];
        var EType = Pattern.type;
        var relatedStat = user.stats[EType];
        var relatedMax = relatedStat.Max;
        // console.log("relatedStat: ", relatedStat);
        if (Number.isNaN(relatedMax)) {
            return 'continue';
        }
        var minSuggestedWeight = 0;
        var maxSuggestedWeight = 0;
        // gwParams
        Pattern.setList.forEach(function (set) {
            // console.log("set: ", set);
            var gwParams = set.gwParams;
            var Reps = gwParams.Reps;
            var RPE = gwParams.RPE; //string "decimal", range, or null
            if (Number.isInteger(Reps) && RPE) {
                //if reps is number and RPE exits (string decimal or null)
                if (set.SuggestedRPE.includes('-')) {
                    var RPERange = set.SuggestedRPE.split('-');
                    var RPE1 = RPERange[0];
                    var RPE2 = RPERange[1];
                    var weight1 = getWeight(relatedMax, set.Reps, RPE1);
                    var weight2 = getWeight(relatedMax, set.Reps, RPE2);
                    minSuggestedWeight = weight1;
                    maxSuggestedWeight = weight2;
                    set.suggestedWeight = weight1 + "-" + weight2;
                    if (weight1 == 0 || weight2 == 0) {
                        set.suggestedWeight = "--";
                    }
                } else {
                    set.suggestedWeight = getWeight(relatedMax, set.Reps, set.SuggestedRPE);
                    if (minSuggestedWeight == 0 || set.suggestedWeight < minSuggestedWeight) {
                        minSuggestedWeight = set.suggestedWeight;
                    }
                    if (maxSuggestedWeight == 0 || set.suggestedWeight > maxSuggestedWeight) {
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
        if (minSuggestedWeight == 0 || maxSuggestedWeight == 0) {} else if (minSuggestedWeight == maxSuggestedWeight) {
            Pattern.suggestedWeightString = "Suggested weight: " + minSuggestedWeight + " lbs";
            Pattern.simpleWeightString = minSuggestedWeight + " lbs";
        } else {
            Pattern.suggestedWeightString = "Suggested weight: " + minSuggestedWeight + "-" + maxSuggestedWeight + " lbs";
            Pattern.simpleWeightString = minSuggestedWeight + "-" + maxSuggestedWeight + " lbs";
        }
    };

    for (var i = 0; i < Patterns.length; i++) {
        var _ret = _loop(i);

        if (_ret === 'continue') continue;
    }
    user.workouts[workoutId].Patterns = Patterns;
    user.changed('workouts', true);
    await user.save();
    // console.log("new Patterns: ", Patterns);
    return;
};

router.get("/:userId/workouts/:workoutId/vue", async function (req, res) {
    console.log("req.params.userId:", req.params.userId);
    console.log("req.params.workoutId", req.params.workoutId);
    var thisID = req.params.workoutId;
    if (req.params.workoutId == "0") {
        thisID = '2';
    }
    console.log("thisID: ", thisID);
    var pasthiddenResponse = {
        hidden: true,
        hiddenText: "This workout is no longer accessible!"
    };
    var futureHiddenResponse = {
        hidden: true,
        hiddenText: "This workout is not accessible yet!"
    };
    _models.User.findById(req.params.userId).then(async function (user) {
        await suggestWeights(user, req.params.workoutId);
        // console.log("user: ", user);
        // console.log("user.workouts", user.workouts, "thisID", thisID);
        var _Workout = user.workouts[thisID];
        console.log("_Workout: ", _Workout, "thisID", thisID);
        var _WorkoutDate = user.workoutDates[thisID - 1];
        var JSON = _Workout;
        JSON.thisWorkoutDate = _WorkoutDate;
        // console.log("this Workout Date get time: ", _WorkoutDate.getTime());
        // console.log("Date.now: ", Date.now());
        // console.log("> Comparison: ", _WorkoutDate.getTime() > Date.now());
        var ahead = _WorkoutDate.getTime() > Date.now();
        var timeDiff = Math.abs(_WorkoutDate.getTime() - Date.now());
        var daysDiff = new Date(timeDiff).getDate();
        daysDiff = timeDiff / (1000 * 60 * 60 * 24);
        var monthDiff = new Date(timeDiff).getMonth();
        console.log("monthDiff: ", monthDiff, "daysDiff: ", daysDiff, "current time: ", new Date(Date.now()));
        console.log("timezone1: ", _WorkoutDate.getTimezoneOffset(), "timezone2: ", new Date(Date.now()).getTimezoneOffset());

        var todayDate = (0, _moment2.default)().local();
        todayDate = todayDate.format('YYYY-MM-DD');

        var checkDate = (0, _moment2.default)(_WorkoutDate).format('YYYY-MM-DD');
        console.log("todayDate: ", todayDate, " checkDate: ", checkDate);
        // console.log("time difference: ", timeDiff);
        // console.log("N Days: ", new Date(timeDiff).getDate());
        if (ahead && daysDiff > 30) {
            res.json(futureHiddenResponse);
            return;
        } else if (!ahead && daysDiff > 30) {
            res.json(pasthiddenResponse);
            return;
        }
        var accessible = false;
        // if (monthDiff == 0 && daysDiff == 0) {
        //     accessible = true;
        // }
        // else {
        //     accessible = false;            
        // }
        if (todayDate == checkDate) {
            accessible = true;
        } else {
            accessible = false;
        }
        JSON.accessible = accessible;
        var editable = false;
        var noedits = false;
        if (user.isAdmin) {
            editable = true;
            noedits = false;
        } else {
            editable = !JSON.completed && JSON.accessible;
            noedits = JSON.completed || !JSON.accessible;
        }
        JSON.editable = editable;
        JSON.noedits = noedits;
        var vueJSON = getVueInfo(JSON);
        vueJSON.accessible = accessible;
        vueJSON.noedits = noedits;

        var workoutDatelist = [];
        var userWorkouts = user.workouts;
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
        vueJSON.workoutDates = workoutDatelist;
        res.json(vueJSON);
    });
});

router.put("/:userId", function (req, res) {
    _models.User.findById(req.params.userId).then(function (user) {
        user.update(req.body).then(function (user) {
            return res.json(user);
        });
    });
});

router.get("/:userId/stats", function (req, res) {
    _models.User.findById(req.params.userId).then(function (user) {
        res.json(user.stats);
    });
});

router.put("/:userId/stats", function (req, res) {
    _models.User.findById(req.params.userId).then(function (user) {
        user.update({
            stats: req.body
        }).then(function (user) {
            return res.json(user);
        });
    });
});

router.get('/:userId/profile-info/', async function (req, res) {
    var _User = await _models.User.findById(req.params.userId);
    var profileBody = {
        username: _User.username,
        level: _User.level,
        blockNum: _User.blockNum
    };
    var nWorkoutsComplete = 0;
    var nWorkouts = 0;
    for (var K in _User.workouts) {
        if (_User.workouts[K].Completed) {
            nWorkoutsComplete++;
        }
        nWorkouts++;
    }
    var percentComplete = Math.round(nWorkoutsComplete * 100 / nWorkouts);
    if (nWorkouts == 0) {
        percentComplete = 0;
    }
    profileBody.percentComplete = percentComplete;
    profileBody.progressText = percentComplete + " % (" + nWorkoutsComplete + "/" + nWorkouts + " complete)";
    res.json(profileBody);
});

router.get('/:userId/stats/vue/get', function (req, res) {
    var userId = req.params.userId;
    _models.User.findById(userId).then(function (user) {
        var JSONStats = user.stats;
        for (var statKey in JSONStats) {
            console.log(statKey);
        }
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
        var percentComplete = Math.round(nWorkoutsComplete * 100 / nWorkouts);
        var vueData = {
            level: user.level,
            blockNum: user.blockNum,
            exerciseTableItems: (0, _vueFormat.vueStats)(JSONStats),
            nPassed: 0,
            nFailed: 0,
            nTesting: 0,
            nWorkoutsComplete: nWorkoutsComplete,
            nWorkouts: nWorkouts,
            percentComplete: percentComplete
        };
        vueData.exerciseTableItems.forEach(function (stat) {
            if (stat.alloyVal == 1) {
                vueData.nPassed++;
            } else if (stat.alloyVal == -1) {
                vueData.nFailed++;
            } else {
                vueData.nTesting++;
            }
        });
        res.json(vueData);
    });
});

router.get('/:userId/progress/vue/get', function (req, res) {
    var userId = req.params.userId;
    _models.User.findById(userId).then(function (user) {
        var JSONStats = user.stats;
        var vueData = (0, _vueFormat.vueProgress)(JSONStats);
        vueData.newLevel = user.level;
        vueData.oldLevel = vueData.levelUpVal == 1 ? user.level - 1 : user.level;
        vueData.nPassed = 0;
        vueData.nFailed = 0;
        vueData.nTesting = 0;
        vueData.levelUpMessage = "";
        vueData.levelUpImage = "";
        vueData.blockNum = user.blockNum;
        if (user.level == 6) {
            vueData.levelUpMessage = _levelupMessages.LevelUpMesssages[6];
        } else if (user.level == 11) {
            vueData.levelUpMessage = _levelupMessages.LevelUpMesssages[11];
        } else if (user.level == 16) {
            vueData.levelUpMessage = _levelupMessages.LevelUpMesssages[16];
        }

        if (vueData.levelUpVal == 1) {
            vueData.statusText = "You have PASSED Level " + vueData.oldLevel;
        } else if (vueData.levelUpVal == -1) {
            vueData.statusText = "You have FAILED Level " + vueData.oldLevel;
        } else {
            vueData.statusText = "Still In Progress";
        }
        vueData.coreExerciseTableItems.forEach(function (stat) {
            if (stat.alloyVal == 1) {
                vueData.nPassed++;
            } else if (stat.alloyVal == -1) {
                vueData.nFailed++;
            } else {
                vueData.nTesting++;
            }
        });
        vueData.secondaryExerciseTableItems.forEach(function (stat) {
            if (stat.alloyVal == 1) {
                vueData.nPassed++;
            } else if (stat.alloyVal == -1) {
                vueData.nFailed++;
            } else {
                vueData.nTesting++;
            }
        });
        res.json(vueData);
    });
});

router.put("/:userId/workouts", function (req, res) {
    _models.User.findById(req.params.userId).then(function (user) {
        user.update({
            workouts: req.body
        }).then(function (user) {
            return res.json(user);
        });
    });
});

router.post("/:userId/oldstats", function (req, res) {
    _models.User.findById(req.params.userId).then(function (user) {
        user.oldstats.push(req.body);
        user.changed('oldstats', true);
        user.save().then(function (user) {
            return res.json(user);
        });
    });
});

router.put("/:userId/get-level", async function (req, res) {
    var _User = await _models.User.findById(req.params.userId);
    var input = req.body;
    await (0, _workoutFunctions.assignLevel)(_User, input);
    await _User.save();
    res.json({
        user: _User,
        viewingWID: 1
    });
    return;
});

router.put("/:userId/generate-workouts", async function (req, res) {
    console.log("put to generate-workouts (line 408): ");
    var input = req.body;
    var _User = await _models.User.findById(req.params.userId);
    if (_User.workoutDates.length > 0) {
        var _oldStat = {
            finishDate: _User.workoutDates[-1],
            level: _User.level
        };
        _oldStat.statDict = _User.stats;
        _User.oldstats.push(_oldStat);
        _User.changed('oldstats', true);
        await _User.save();
    }
    if (_User.level >= 11) {
        _User.blockNum = parseInt(req.body.blockNum);
        if (_User.level >= 16) {
            _User.levelGroup = 4;
        } else {
            _User.levelGroup = 3;
        }
    } else {
        if (_User.level >= 6) {
            _User.levelGroup = 2;
        } else {
            _User.levelGroup = 1;
        }
        _User.blockNum = 0;
    }
    await _User.save();
    var stringDate = false;
    var startDate = "";
    if (input.startDate) {
        //will autoconvert startdate
        startDate = input.startDate;
        stringDate = true;
    } else {
        startDate = input.formattedDate;
        stringDate = false;
    }
    var daysList = [parseInt(input["Day-1"]), parseInt(input["Day-2"]), parseInt(input["Day-3"])];
    await (0, _generateWorkouts.generateWorkouts)(_User, startDate, daysList, stringDate);
    //Formerly used assignWorkouts(_User, input)
    await _User.save();
    res.json({ input: input, updatedUser: _User, session: {
            viewingWID: 1,
            User: _User,
            username: _User.username,
            userId: _User.id
        } });
    return;
});

router.post("/:userId/get-next-workouts", async function (req, res) {
    console.log("posting to get-next-workouts (line 432): ");
    // console.log("userId: ", req.params.userId);
    var _User = await _models.User.findById(req.params.userId);
    var input = req.body;
    console.log("input.workoutLevel: ", input.workoutLevel);
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
            level: _User.level
        };
        var _oldWorkouts = _User.workouts;
        _oldStat.statDict = _User.stats;
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
            } else {
                _User.levelGroup = 3;
            }
        } else {
            if (_User.level >= 6) {
                _User.levelGroup = 2;
            } else {
                _User.levelGroup = 1;
            }
            _User.blockNum = 0;
        }
        await _User.save();
    }
    console.log("line 501");
    var stringDate = false;
    var startDate = "";
    if (input.startDate) {
        //will autoconvert startdate
        startDate = input.startDate;
        stringDate = true;
    } else {
        startDate = input.formattedDate;
        stringDate = false;
    }
    var daysList = [parseInt(input["Day-1"]), parseInt(input["Day-2"]), parseInt(input["Day-3"])];
    await (0, _generateWorkouts.generateWorkouts)(_User, startDate, daysList, stringDate);
    // Formerly used await assignWorkouts(_User, input);        
    await _User.save();

    res.json({ input: input, updatedUser: _User, session: {
            viewingWID: 1,
            User: _User,
            username: _User.username,
            userId: _User.id
        } });
    // res.send("test");
    return;
});

// admin set-level post info:
// {
// startDate: "YYYY-MM-DD",
// daysList: [1, 3, 5],
// newLevel: 18,
// }

router.post("/:userId/admin/generate-workouts", async function (req, res) {
    console.log("ADMIN GENERATE WORKOUTS: (LINE 457)");
    // console.log("req.body: ", req.body);
    console.log("startDate: ", req.body.startDate);
    var _User = await _models.User.findById(req.params.userId);
    if (_User.workoutDates.length > 0) {
        var lastWDate = _User.workoutDates[_User.workoutDates.length - 1];
        console.log("last workout date in list: ", _User.workoutDates[_User.workoutDates.length - 1]);
        var _oldStat = {
            finishDate: lastWDate,
            level: _User.level
        };
        var _oldWorkouts = _User.workouts;
        _oldStat.statDict = _User.stats;
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
        if (req.body.blockNum) {
            _User.blockNum = parseInt(req.body.blockNum);
        }
        if (_User.level >= 16) {
            _User.levelGroup = 4;
        } else {
            _User.levelGroup = 3;
        }
    } else {
        if (_User.level >= 6) {
            _User.levelGroup = 2;
        } else {
            _User.levelGroup = 1;
        }
        _User.blockNum = 0;
    }
    await _User.save();
    var stringDate = false;
    if (req.body.stringDate) {
        stringDate = true;
    }
    var startDate = req.body.startDate;
    var daysList = req.body.daysList;
    var output = await (0, _generateWorkouts.generateWorkouts)(_User, startDate, daysList, true);
    // res.json(output);
    res.json(_User);
});

router.post(":/userId/set-level", async function (req, res) {
    var newLevel = parseInt(req.body.level);
    var user = await _models.User.findById(req.params.userId);
    user.level = newLevel;
    await user.save();
    res.json(user);
});

router.post("/:userId/old-stats/clear", async function (req, res) {});

router.get("/:userId/videos", async function (req, res) {
    var videosUser = await _models.User.findById(req.params.userId);
    var videos = VideosVue(VideosJSON, videosUser.level);
    res.json(videos);
});

module.exports = router;