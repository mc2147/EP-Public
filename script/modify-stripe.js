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
 // Get stripe connect set up
 try {
  let oldMarkoStripeId = 'cus_DGVyX6LdlpTwoA';
  let markoStripeId = 'cus_DZiXV4EURXbxlM';
  let markoCardid = 'card_1CpyweJ14t7rQNsf2mxyR3QY';

  let markoStripeToken = await stripe.tokens.create({
   customer: oldMarkoStripeId,
   card: markoCardid
  });
  console.log('markoStripeToken: ', markoStripeToken);

  await stripe.customers.update(markoStripeId, {
      source: markoStripeToken.id,
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
