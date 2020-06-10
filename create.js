import handler from "./libs/handler-lib"; // uvozi async Lambda funkciju
import * as uuid from "uuid"; // generates unique ids, we need this for storing things to DynamoDB
import dynamoDb from "./libs/dynamodb-lib"; // uvozi metod put za kreiranje note-a

export const main = handler(async (event, context) => {
  // Request body is passed in as a JSON encoded string in 'event.body', HTTP request parameters
  const data = JSON.parse(event.body);
  const params = {
    TableName: process.env.tableName,
    // 'Item' contains the attributes of the item to be created
    // - 'userId': user identities are federated through the
    //             Cognito Identity Pool, we will use the identity id
    //             as the user id of the authenticated user
    // - 'noteId': a unique uuid
    // - 'content': parsed from request body
    // - 'attachment': parsed from request body
    // - 'createdAt': current Unix timestamp
    Item: {
      userId: event.requestContext.identity.cognitoIdentityId,
      noteId: uuid.v1(),
      content: data.content,
      attachment: data.attachment,
      createdAt: Date.now()
    }
  };

  await dynamoDb.put(params);

  return params.Item;
});