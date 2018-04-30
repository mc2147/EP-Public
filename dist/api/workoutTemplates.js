'use strict';

var session = require('express-session');
var Promise = require("bluebird");
var bodyParser = require('body-parser');
var express = require('express');
var bcrypt = require('bcryptjs');

var router = express.Router();
var models = require('../models');
var WorkoutTemplate = models.WorkoutTemplate;
var SubWorkoutTemplate = models.SubWorkoutTemplate;

router.get('/', function (req, res) {
    WorkoutTemplate.findAll({
        where: {},
        include: [{ model: SubWorkoutTemplate, as: 'subWorkouts', required: true }]
    }).then(function (result) {
        res.json(result);
    });
});

router.get('/:LGroup', function (req, res) {
    WorkoutTemplate.findAll({
        where: {
            levelGroup: req.params.LGroup
        },
        include: [{ model: SubWorkoutTemplate, as: 'subWorkouts', required: true }]
    }).then(function (result) {
        console.log("result", result);
        res.json(result);
    });
});

router.get('/:LGroup/block/:blockNum', function (req, res) {
    WorkoutTemplate.findAll({
        where: {
            levelGroup: req.params.LGroup,
            block: req.params.blockNum
        },
        include: [{ model: SubWorkoutTemplate, as: 'subWorkouts', required: true }]
    }).then(function (result) {
        console.log("result", result);
        res.json(result);
    });
});

router.get('/:LGroup/block/:blockNum/week/:week', function (req, res) {
    WorkoutTemplate.findAll({
        where: {
            levelGroup: req.params.LGroup,
            block: req.params.blockNum,
            week: req.params.week
        },
        include: [{ model: SubWorkoutTemplate, as: 'subWorkouts', required: true }]
    }).then(function (result) {
        res.json(result);
    });
});

router.get('/:LGroup/block/:blockNum/week/:week/day/:day', function (req, res) {
    WorkoutTemplate.findOne({
        where: {
            levelGroup: req.params.LGroup,
            block: req.params.blockNum,
            week: req.params.week,
            day: req.params.day
        },
        include: [{ model: SubWorkoutTemplate, as: 'subWorkouts', required: true }]
    }).then(function (result) {
        res.json(result);
    });
});

router.get('/:LGroup/block/:blockNum/week/:week/day/:day/subworkouts', function (req, res) {
    WorkoutTemplate.findOne({
        where: {
            levelGroup: req.params.LGroup,
            block: req.params.blockNum,
            week: req.params.week,
            day: req.params.day
        },
        include: [{ model: SubWorkoutTemplate, as: 'subWorkouts', required: true }]
    }).then(function (result) {
        result.subWorkouts.sort(function (a, b) {
            return a.number - b.number;
        });
        res.json(result.subWorkouts);
    });
});

module.exports = router;