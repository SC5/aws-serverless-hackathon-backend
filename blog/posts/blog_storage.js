'use strict';

const tablePostfix = '-blog-aws-serverless-hackathon',
  AWS = require('aws-sdk'),
  config = {
    region: AWS.config.region || process.env.SERVERLESS_REGION || 'eu-west-1' // replace with yours region for local testing, e.g 'eu-west-1'
  },
  dynamodb = new AWS.DynamoDB.DocumentClient(config);

module.exports = {

  // Get all posts
  // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#scan-property
  getPosts: (event, cb) => {
    let params = {
      TableName: event.stage + tablePostfix,
      AttributesToGet: [
        'id',
        'title',
        'content',
        'date'
      ]
    };

    dynamodb.scan(params, (error, response) => {
      return cb(error, response);
    });
  },

  // Add new or edit post
  // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#put-property
  savePost: (event, cb) => {
    // If PUT request, set Id from path to object
    if(event.path && event.path.id) {
      event.body.id = event.path.id;
    }
    let params = {
      TableName: event.stage + tablePostfix,
      Item: event.body
    };

    dynamodb.put(params, (error, response) => {
      if (!error) {
        response = {
          post: event.body
        };
      }
      return cb(error, response);
    });
  },

  // Delete post
  // @see: http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#delete-property
  deletePost: (event, cb) => {
    let params = {
      TableName: event.stage + tablePostfix,
      Key: {id: event.path.id}
    };

    dynamodb.delete(params, (error, response) => {
      if (!error) {
        response = {
          deleted: event.id
        };
      }
      return cb(error, response);
    });
  }
};
