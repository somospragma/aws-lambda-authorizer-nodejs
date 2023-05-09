'use strict';

const jwt = require('jsonwebtoken');
const { mockClient } = require("aws-sdk-client-mock");
const { DynamoDBDocumentClient, GetCommand } = require("@aws-sdk/lib-dynamodb");
const { handler } = require('../../main/lambda/function');

const dynamo = mockClient(DynamoDBDocumentClient);

describe('Test handler function', () => {

    const eventGood = {
        authorizationToken: 'eyJraWQiOiJCZkd6eWF0OVVvVngrZGs2S1hcL1VHTWNBWTltS21ENnA5bVZ5cnkrdlRFaz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI0MzFmY2M1MS1kZTQ4LTQ4MWYtOWU5OS0xMmJjMTMxNjYwYjMiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9aeVE4clNLSGciLCJjbGllbnRfaWQiOiI0aGRsMDZvYXZsM3A1YmQyODUwNTFzamZsZSIsIm9yaWdpbl9qdGkiOiI3YmRmYjE4YS1iYzAzLTQ5NTAtYjJmZi1hNjFkYmEyZWE2MTIiLCJldmVudF9pZCI6IjA4MGE5NTVkLTg1OTItNGFkNi1hYzQyLTNjMzk2NDcwZDExYyIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2ODM2NTE4OTgsImV4cCI6MTY4MzY1NTQ5OCwiaWF0IjoxNjgzNjUxODk4LCJqdGkiOiI3ZDVkZjA2OS1lNzdjLTQ5MGQtYTM3Ni1mNWEyNGFmZTU0MjUiLCJ1c2VybmFtZSI6ImMxMTUyMTk3NTg4In0.8SGwtbpHRVBnAoj1ZW_MTC0s20dHG5s6PEPMs07ctI-pFzMRRqr6VBeYNlQTYCeTztpKHLl5u7dA0mmiiVeEMu5jSB0rNgouyN5PKRLgc-CIZRHibX6Orch9wwkZsc79jCm6uyY0SUMs-G3plf3e_5dHmFfNBk0kNiZDw8tLkIDxavOnLcMlOIw8dYmk1V_WvLEKOuJqHLmVnx0ZUAaUACWBTXmi0yBYBMnxXDs8C1c1F-YsZ3aDIlTOp3IQYFgI5aYraJuZzQNtIM9fyHugDRXWLFsK8atyTWYKroKUk2xPVz3V9ArBhzhFV_ocTfIaZ-BqcNj3cHbUSEPVa-XMOA',
        methodArn: 'methodArn/sampleResource/good'
    };

    const eventBad = {
        authorizationToken: 'eyJraWQiOiJCZkd6eWF0OVVvVngrZGs2S1hcL1VHTWNBWTltS21ENnA5bVZ5cnkrdlRFaz0iLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiI0MzFmY2M1MS1kZTQ4LTQ4MWYtOWU5OS0xMmJjMTMxNjYwYjMiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9aeVE4clNLSGciLCJjbGllbnRfaWQiOiI0aGRsMDZvYXZsM3A1YmQyODUwNTFzamZsZSIsIm9yaWdpbl9qdGkiOiI3YmRmYjE4YS1iYzAzLTQ5NTAtYjJmZi1hNjFkYmEyZWE2MTIiLCJldmVudF9pZCI6IjA4MGE5NTVkLTg1OTItNGFkNi1hYzQyLTNjMzk2NDcwZDExYyIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE2ODM2NTE4OTgsImV4cCI6MTY4MzY1NTQ5OCwiaWF0IjoxNjgzNjUxODk4LCJqdGkiOiI3ZDVkZjA2OS1lNzdjLTQ5MGQtYTM3Ni1mNWEyNGFmZTU0MjUiLCJ1c2VybmFtZSI6ImMxMTUyMTk3NTg4In0.8SGwtbpHRVBnAoj1ZW_MTC0s20dHG5s6PEPMs07ctI-pFzMRRqr6VBeYNlQTYCeTztpKHLl5u7dA0mmiiVeEMu5jSB0rNgouyN5PKRLgc-CIZRHibX6Orch9wwkZsc79jCm6uyY0SUMs-G3plf3e_5dHmFfNBk0kNiZDw8tLkIDxavOnLcMlOIw8dYmk1V_WvLEKOuJqHLmVnx0ZUAaUACWBTXmi0yBYBMnxXDs8C1c1F-YsZ3aDIlTOp3IQYFgI5aYraJuZzQNtIM9fyHugDRXWLFsK8atyTWYKroKUk2xPVz3V9ArBhzhFV_ocTfIaZ-BqcNj3cHbUSEPVa-XMOA',
        methodArn: 'methodArn/sampleResource/bad'
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
        jest.spyOn(jwt, 'verify').mockImplementation(() => {
            return true;
        });
        //jest.spyOn(jwt, 'decode').mockImplementation(() => {
        //    return { userRole: 'user' };
        //});

        //jest.spyOn(jwt, 'verify').mockReturnValue(true);
        //jest.spyOn(jwt, 'decode').mockReturnValue({ userRole: 'user' });
        dynamo.on(GetCommand).resolves({
            Item: {
                paths: "methodArn/sampleResource/good",
                userRole: "admin"
            },
        });
        //jest.spyOn(dynamo.prototype, 'get').mockImplementation(mockDynamoGet);
        //jest.spyOn(dynamo.prototype, 'get').mockReturnValue({
        //    promise: () => Promise.resolve({ Item: { userRole: 'user', paths: ['sampleResource/*'] } })
        //});
    });

    afterEach(() => {
        //    dynamo.prototype.get.mockRestore();
        jest.restoreAllMocks();
    });

    describe('when given a valid token and resource', () => {

        it('should generate an Allow policy for valid userRole and resource', async () => {
            const result = await handler(eventGood);
            const expectedResponse = generatePolicy('user', 'Allow', eventGood.methodArn);
            expect(result).toEqual(expectedResponse);
        });

        it('should generate a Deny policy for invalid userRole and resource', async () => {
            const result = await handler(eventBad);
            const expectedResponse = generatePolicy('user', 'Deny', eventBad.methodArn);
            expect(result).toEqual(expectedResponse);
        });

        it('should generate a Deny policy for invalid token', async () => {
            jest.spyOn(jwt, 'verify').mockImplementation(() => { throw new Error('Invalid token'); });
            const result = await handler(eventGood);
            const expectedResponse = generatePolicy('user', 'Deny', eventGood.methodArn);

            expect(result).toEqual(expectedResponse);
        });
    });
});