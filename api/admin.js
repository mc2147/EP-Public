// const session = require('express-session');
import session from 'express-session';
import Promise from "bluebird";
var bodyParser = require('body-parser');
var express = require('express');
const bcrypt    = require('bcryptjs');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
import {getSubscriptionInfo} from './apiFunctions/stripeFunctions';
import {signupUser, accessInfo} from './apiFunctions/userFunctions';
import {assignWorkouts, assignLevel, getblankPatterns, rescheduleWorkouts} from './apiFunctions/workoutFunctions';
import {generateHash} from './apiFunctions/userFunctions';
import {updateSpecial} from './apiFunctions/workoutUpdate'
import {generateWorkouts} from './apiFunctions/generateWorkouts';
import {vueStats, getVueStat, vueProgress} from './vueFormat';
import {LevelUpMesssages} from '../content/levelupMessages'
import {sendMail, testEmail} from './email';
var router = express.Router();
import {Video, Exercise, WorkoutTemplate, SubWorkoutTemplate, Workout, User} from '../models';
import moment from 'moment';
var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
console.log('secret key: ', process.env.STRIPE_SECRET_KEY)

router.get('/testing', async function(req, res) {
    res.json('testing admin route');
})

router.get('/videos/match-exercise/:category/:level', async function(req, res) {
    Video.matchExercise(req.params.category, req.params.level).then(response => {
        res.json(response);
    })
})

router.post('/videos', async function (req, res) {
    let inputs = req.body;
    console.log('Creating video: ', inputs);
    Video.create(inputs).then(video => {
        res.json(video);
    })
})

router.put('/videos/:id', async function(req, res) {
    let inputs = req.body;
    console.log('inputs: ', inputs);
    Video.findOne({
        where:{
            id:req.params.id,
        }
    }).then(video => {
        video.update(inputs);
        console.log('line 37');
        video.save().then(savedVideo => {
            console.log('line 39');
            res.json(savedVideo);
        })
    });
})

router.delete('/videos/:id', async function(req, res) {
    console.log('deleting video: ', req.params.id);
    Video.findOne({
        where:{
            id:req.params.id,
        }
    }).then(video => {
        // video.destroy().then(() => {
        //     res.json({
        //         videoDestroyed: true,
        //     })
        // });
        res.json({
            testing: true,
        })
    });
})


module.exports = router;