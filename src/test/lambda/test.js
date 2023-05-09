'use strict';
const jwt = require('jsonwebtoken');
const dynamo = require('aws-sdk/clients/dynamodb');
const handler = require('../../main/lambda/function');

describe('Test handler function', () => {
    const event = {
        authorizationToken: 'sampleToken',
        methodArn: 'methodArn/sampleResource/1234'
    };

    const generatePolicy = (principalId, effect, resource) => {
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
    };

    beforeEach(() => {
        jest.spyOn(dynamo.prototype, 'get').mockImplementation(() => {
            const response = {
                Item: {
                    userRole: 'user',
                    paths: [
                        'sampleResource/*'
                    ]
                }
            };
            return {
                promise: () => Promise.resolve(response)
            };
        });
    });

    afterEach(() => {
        dynamo.prototype.get.mockRestore();
    });

    it('should generate an Allow policy for valid userRole and resource', async () => {
        jest.spyOn(jwt, 'verify').mockImplementation(() => {
            return true;
        });

        jest.spyOn(jwt, 'decode').mockImplementation(() => {
            return { userRole: 'user' };
        });

        const result = await handler(event);
        const expectedResponse = generatePolicy('user', 'Allow', 'methodArn/sampleResource/1234');

        expect(result).toEqual(expectedResponse);
    });

    it('should generate a Deny policy for invalid userRole and resource', async () => {
        jest.spyOn(jwt, 'verify').mockImplementation(() => {
            return true;
        });

        jest.spyOn(jwt, 'decode').mockImplementation(() => {
            return { userRole: 'admin' };
        });

        const result = await handler(event);
        const expectedResponse = generatePolicy('user', 'Deny', 'methodArn/sampleResource/1234');
        expect(result).toEqual(expectedResponse);
    });

    it('should generate a Deny policy for invalid token', async () => {
        jest.spyOn(jwt, 'verify').mockImplementation(() => { throw new Error('Invalid token'); });

        const result = await handler(event);
        const expectedResponse = generatePolicy(null, 'Deny', event.methodArn);

        expect(result).toEqual(expectedResponse);
    });
});