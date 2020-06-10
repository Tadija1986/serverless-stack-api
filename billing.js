/*eslint no-trailing-spaces: ["error", { "ignoreComments": true }]*/
// Add a Billing API
// It is going to take a Stripe token and the number of notes the user wants to store
import handler from "./libs/handler-lib";
import stripePackage from "stripe";
import { calculateCost } from "./libs/billing-lib";

export const main = handler(async (event, context) => {
  // We get the storage and source from the request body
  // The storage variable is the number of notes the user would like to store in his account
  // And source is the Stripe token for the card that we are going to charge
  const { storage, source } = JSON.parse(event.body);
  // We are using a calculateCost(storage) function to figure out 
  // how much to charge a user based on the number of notes that are going to be stored
  const amount = calculateCost(storage);
  const description = "Scratch charge";
  // Load our secret key from the  environment variables
  // We create a new Stripe object using our Stripe Secret key
  // We are going to get this as an environment variable
  // We do not want to put our secret keys in our code and commit that to Git, this is a security issue
  const stripe = stripePackage(process.env.stripeSecretKey);
  // We use the stripe.charges.create method to charge the user and respond to the request if everything went through successfully
  await stripe.charges.create({
    source,
    amount,
    description,
    currency: "usd"
  });
  return { status: true };
});