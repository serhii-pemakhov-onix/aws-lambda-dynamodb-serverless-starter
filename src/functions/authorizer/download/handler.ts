import { APIGatewayRequestAuthorizerHandler } from 'aws-lambda';
import { generateInvokePolicyDocument } from '@libs/policy-generator';

export const main: APIGatewayRequestAuthorizerHandler = async (event) => {
  const { Authorization: token } = event.headers;

  // Naive authentication strategy
  // all requests with a "token" containing the "allowMeToDownload" string are accepted
  const isAuthorized = token?.includes('allowMeToDownload');

  return generateInvokePolicyDocument(
    event.methodArn,
    isAuthorized ? 'Allow' : 'Deny',
  );
};
