'use strict';

const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const dynamo = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const token = event.authorizationToken;
    const resource = event.methodArn.split('/')[0] + '/*';
    
    const decodedToken = jwt.verify(token, process.env.COGNITO_JWT_SECRET);
    const userRole = jwt.decode(token).userRole;

    const result = await dynamo.get({
      TableName: 'TableRoles',
      Key: { userRole },
    }).promise();

    if (result && result.Item && result.Item.paths.includes(resource)) {
      return generatePolicy('user', 'Allow', event.methodArn);
    } else {
      return generatePolicy('user', 'Deny', event.methodArn);
    }
  } catch (error) {
    console.error('Error al consultar la tabla de DynamoDB: ', error);
    return generatePolicy('user', 'Deny', event.methodArn);
  }
};

function generatePolicy(principalId, effect, resource) {
  const authResponse = {};
  authResponse.principalId = principalId;
  if (effect && resource) {
    const policyDocument = {};
    policyDocument.Version = '2012-10-17';
    policyDocument.Statement = [];
    const statementOne = {};
    statementOne.Action = 'execute-api:Invoke';
    statementOne.Effect = effect;
    statementOne.Resource = resource;
    policyDocument.Statement[0] = statementOne;
    authResponse.policyDocument = policyDocument;
  }
  return authResponse;
}