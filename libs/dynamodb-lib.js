import AWS from "aws-sdk"; // allows us to talk to the various AWS services, ucitava AWS SDK za Node.js
const client = new AWS.DynamoDB.DocumentClient(); // kreira DynamoDB dokument client sa setom konfigurabilnih opcija
// Promise form of the DynamoDB methods
// Promises are a method for managing asynchronous code that serve as an alternative to the standard callback function syntax
// We are exposing the DynamoDB client methods (CRUD) that we are going to need
export default {
  get: (params) => client.get(params).promise(),
  put: (params) => client.put(params).promise(),
  query: (params) => client.query(params).promise(),
  update: (params) => client.update(params).promise(),
  delete: (params) => client.delete(params).promise(),
};
