import { APIGatewayRequestAuthorizerHandler } from 'aws-lambda';
import { generateInvokePolicyDocument } from '@libs/policy-generator';

export const main: APIGatewayRequestAuthorizerHandler = async (event) => {
  const { Authorization: token } = event.headers;

  // Naive authentication strategy
  // all requests with a "token" containing the "allowMeToUpload" string are accepted
  const isAllowed = token?.includes('allowMeToUpload');

  return generateInvokePolicyDocument(
    event.methodArn,
    isAllowed ? 'Allow' : 'Deny',
  );
};
