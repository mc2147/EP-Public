import {getWorkoutDays} from '../../globals/functions';
import {AllWorkouts, ExerciseDict} from '../../data';
import {DaysofWeekDict} from '../../globals/enums';
import {User, Video} from '../../models';
import axios from 'axios';
import bcrypt from 'bcryptjs';
var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const saltRounds = 10;

function generateSalt(){
    return bcrypt.genSaltSync(saltRounds);
}

export function generateHash (password, salt){
    return bcrypt.hashSync(password, salt, null);
}

export async function signupUser(input) {
    var P1 = input.P1;
    var P2 = input.P2;
    var username = input.username;
    var salt = generateSalt();
    if (P1 == P2) {
        var hashedPassword = generateHash(P1, salt);
        var newUser = await User.create({
            // id: 29,
            username: username,
            salt: salt,
            password: hashedPassword,
        });
        if (newUser) {
            return({
                newUser,
                session: {
                    userId: newUser.id,
                    username: username,
                    User: newUser,        
                }
            });
        }
        else {
            return({
                error: true,
                status: "error"
            })
        }
    }
    else {
        return false
    }
}

export async function assignLevel(_User, input) {
    let {squatWeight, benchWeight, RPEExp, bodyWeight} = input; 
    if (squatWeight < benchWeight) {
        _User.level = 1;
    }
    else if (squatWeight > bodyWeight*1.5 && benchWeight > bodyWeight && RPEExp) {
        _User.level = 11;
    }
    else {
        _User.level = 6;
    }
    await _User.save();
}

export async function accessInfo(user) {
    let response = Object.assign({}, user);
    let Now = new Date(Date.now());
    // Workouts
    let hasLevel = true; //send to enter stats page
    let initialized = user.initialized;
    let hasWorkouts = false; //level-up get-next-workouts or get-initial-workouts
    let missedWorkouts = false; //reschedule workouts prompt
    // Stipe & Subscription
    let hasStripe = false;
    let hasSubscription = false;
    let subscriptionValid = false;
    let subscriptionExpired = false;
    // let initialized = false;
    let subscriptionStatus = null;    
    let accessLevel = 0;
    // 
    if (user.stripeId != "") {
        try {
            let stripeUser = await stripe.customers.retrieve(user.stripeId);
            if (stripeUser.subscriptions.data.length > 0) {
                hasSubscription = true;
                subscriptionStatus = stripeUser.subscriptions.data[0].status;
                if (subscriptionStatus == 'trialing' || subscriptionStatus == 'active') {
                    subscriptionValid = true;
                }
                else {
                    subscriptionExpired = true;
                }
            }
            hasStripe = true;
        }
        catch(error) {
            hasStripe = false;
        }
    }
    
    if (!user.level || user.level == 0 || user.level == null) {
        hasLevel = false;
    }
    if (user.workoutDates.length > 0) {
        hasWorkouts = true;
    }
    if (user.workoutDates.length > 0 || user.oldworkouts.length > 0) {
        // initialized = true;
    }
    for (var K in user.workouts) {
        let W = user.workouts[K];
        let wDate = new Date(W.Date);        
        if (//If there's an incomplete workout before the current date
            !W.Completed 
            && wDate 
            && wDate.getDate() < Now.getDate() 
            && wDate.getMonth() <= Now.getMonth()) {
                missedWorkouts = true;
                break
        }
    }	
    let output = {
        // Stripe & Subcriptions
        hasStripe,
        hasSubscription,
        subscriptionValid,
        subscriptionStatus,
        subscriptionExpired,
        // Workouts
        hasLevel,
        hasWorkouts,
        missedWorkouts,        
        initialized,
    }
    // console.log
    if (hasSubscription) {
        accessLevel = 1;
    }
    if (hasSubscription && hasLevel) {
        accessLevel = 2;       
    }
    if (hasSubscription && hasLevel && initialized) {
        accessLevel = 3;       
    }
    if (hasSubscription && hasLevel && subscriptionValid) {
        accessLevel = 4;       
    }
    if (hasSubscription && hasLevel && subscriptionValid && hasWorkouts) {
        accessLevel = 5;       
    }
    if ((hasSubscription && hasLevel && subscriptionValid && hasWorkouts && !missedWorkouts)
    || user.isAdmin) {
        accessLevel = 6;       
    }
    return {
        // Stripe & Subcriptions
        hasStripe,
        hasSubscription,
        subscriptionValid,
        subscriptionStatus,
        subscriptionExpired,
        // Workouts
        hasLevel,
        hasWorkouts,
        missedWorkouts,
        // Access Level
        accessLevel
    }                        
}
