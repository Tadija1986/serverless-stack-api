// We want to make our Lambda function async, and simply return the results, without having to call the callback method.
// We want to use async/await when working with our database calls.
// We want to centrally handle any errors in our Lambda functions.
// Since all of our Lambda functions will be handling API endpoints, we want to handle our HTTP responses in one place.
// We are creating a handler function that we’ll use as a wrapper around our Lambda functions.
// It takes our Lambda function as the argument.
// It uses the Promise.resolve() pattern here because our Lambda functions could return a Promise (be asynchronous) or not and this lets us handle both the cases.
// export default function handler(lambda) {
//   return function (event, context) {
//     return (
//       Promise.resolve()
//         // first run the Lambda function
//         .then(() => lambda(event, context))
//         // On success return value as responseBody
//         .then((responseBody) => [200, responseBody])
//         // On failure return error message
//         .catch((e) => {
//           return [500, { error: e.message }];
//         })
//         // Return HTTP response with status code and headers
//         .then(([statusCode, body]) => ({
//           statusCode,
//           headers: {
//             "Access-Control-Allow-Origin": "*",
//             "Access-Control-Allow-Credentials": true,
//           },
//           body: JSON.stringify(body),
//         }))
//     );
//   };
// }
import * as debug from "./debug-lib";

export default function handler(lambda) {
  return function (event, context) {
    return Promise.resolve()
      // Start debugger
      .then(() => debug.init(event, context))
      // Run the Lambda
      .then(() => lambda(event, context))
      // On success
      .then((responseBody) => [200, responseBody])
      // On failure
      .catch((e) => {
        // Print debug messages
        debug.flush(e);
        return [500, { error: e.message }];
      })
      // Return HTTP response
      .then(([statusCode, body]) => ({
        statusCode,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Credentials": true,
        },
        body: JSON.stringify(body),
      }))
      // Cleanup debugger
      .finally(debug.end);
  };
}
