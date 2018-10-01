"use strict";

var _expressSession = require("express-session");

var _expressSession2 = _interopRequireDefault(_expressSession);

var _bluebird = require("bluebird");

var _bluebird2 = _interopRequireDefault(_bluebird);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var bodyParser = require("body-parser");
var express = require("express");
var bcrypt = require("bcryptjs");
var stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
var router = express.Router();

var allErrors = [];

router.get("/customers", async function (req, res) {
  var stripeCustomers = await stripe.customers.list({ limit: 100 });
  res.json(stripeCustomers);
});

router.post("/update-card", async function (req, res) {
  try {
    var _req$body = req.body,
        stripeId = _req$body.stripeId,
        stripeToken = _req$body.stripeToken,
        userEmail = _req$body.userEmail;

    var stripeUser = await stripe.customers.retrieve(stripeId);

    res.json({
      success: true
    });
    return;
  } catch (error) {
    allErrors.push(error);

    res.json({ error: error, fail: true });
    return;
  }
});

router.get("errors", async function (req, res) {
  res.json(errors);
});

router.get("/customers-custom", async function (req, res) {
  var stripeCustomers = await stripe.customers.list({ limit: 50 });

  for (var i = 0; i < stripeCustomers.data.length; i++) {
    var customer = stripeCustomers.data[i];
    var charges = await stripe.charges.list({ customer: customer.id });
    var subscriptions = customer.subscriptions.data;
    customer.subscriptionStatus = "None";
    customer.MRR = 0;
    if (subscriptions.length > 0) {
      var currentSubscription = subscriptions[0];
      customer.subscriptionStatus = currentSubscription.status;
      customer.MRR = currentSubscription.plan.amount / currentSubscription.plan.interval_count;
      customer.subscriptionPlan = currentSubscription.plan.nickname;
    }
    var totalBilled = 0;
    charges.data.forEach(function (charge) {
      totalBilled += charge.amount - charge.amount_refunded;
    });
    customer.totalBilled = totalBilled;
    customer.charges = charges.data;
    console.log("adding charges: ", i);
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