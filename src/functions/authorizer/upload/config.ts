import { handlerPath } from '@libs/handler-resolver';

export const getUploadUrlAuthorizer = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    // eslint-disable-next-line no-template-curly-in-string
    GET_UPLOAD_URL_LAMBDA_ARN: '${self:custom.getSignedUploadUrlArn}',
  },
};
