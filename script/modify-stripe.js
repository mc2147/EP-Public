const { CreateUser, SetUser } = require("../models/createUser");
const {
  WorkoutTemplate,
  SubWorkoutTemplate,
  User,
  Video
} = require("../models/index");
var stripe = require("stripe")('sk_live_OXwkp7SjAleSx9u6QLlUns0U');

console.log('modify-stripe.js running...');
console.log('process.env.STRIPE_SECRET_KEY: ', process.env.STRIPE_SECRET_KEY);

async function modifyStripe() {
 // Modularize this shit later
 try {
  let markoStripeId = 'cus_DZiXV4EURXbxlM';
  let markoStripeToken = 'card_1CpyweJ14t7rQNsf2mxyR3QY';
  await stripe.customers.update(markoStripeId, {
      source: markoStripeToken,
  });
 } 
 catch (error) {
   console.log('modify stripe error: ', error);
 }
}

modifyStripe()
  .catch(err => {
    console.log("error!!!");
    console.error(err.message);
    console.error(err.stack);
    process.exitCode = 1;
  })
  .then(() => {
    console.log("finished modifying stripe data!!!");
    process.exitCode = 0;
  });
