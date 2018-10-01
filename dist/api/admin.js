"use strict";

var _expressSession = require("express-session");

var _expressSession2 = _interopRequireDefault(_expressSession);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

var _stripeFunctions = require("./apiFunctions/stripeFunctions");

var _userFunctions = require("./apiFunctions/userFunctions");

var _workoutFunctions = require("./apiFunctions/workoutFunctions");

var _workoutUpdate = require("./apiFunctions/workoutUpdate");

var _generateWorkouts = require("./apiFunctions/generateWorkouts");

var _vueFormat = require("./vueFormat");

var _levelupMessages = require("../content/levelupMessages");

var _email = require("./email");

var _models = require("../models");

var _moment = require("moment");

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// const session = require('express-session');
var bodyParser = require("body-parser");
var express = require("express");
var bcrypt = require("bcryptjs");
var Sequelize = require("sequelize");
var Op = Sequelize.Op;

var router = express.Router();

var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
console.log("secret key: ", process.env.STRIPE_SECRET_KEY);

router.get("/testing", async function (req, res) {
  res.json("testing admin route");
});

router.get("/videos/match-exercise/:category/:level", async function (req, res) {
  _models.Video.matchExercise(req.params.category, req.params.level).then(function (response) {
    res.json(response);
  });
});

router.post("/videos", async function (req, res) {
  var inputs = req.body;
  console.log("Creating video: ", inputs);
  _models.Video.create(inputs).then(function (video) {
    res.json(video);
  });
});

router.put("/videos/:id", async function (req, res) {
  var inputs = req.body;
  console.log("inputs: ", inputs);
  _models.Video.findOne({
    where: {
      id: req.params.id
    }
  }).then(function (video) {
    video.update(inputs);
    console.log("line 37");
    video.save().then(function (savedVideo) {
      console.log("line 39");
      res.json(savedVideo);
    });
  });
});

router.delete("/videos/:id", async function (req, res) {
  console.log("deleting video: ", req.params.id);
  _models.Video.findOne({
    where: {
      id: req.params.id
    }
  }).then(function (video) {
    video.destroy().then(function () {
      res.json({
        videoDestroyed: true
      });
    });
  });
});

module.exports = router;