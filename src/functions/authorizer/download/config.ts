import { handlerPath } from '@libs/handler-resolver';

export const getDownloadUrlAuthorizer = {
  handler: `${handlerPath(__dirname)}/handler.main`,
  environment: {
    // eslint-disable-next-line no-template-curly-in-string
    GET_DOWNLOAD_URL_LAMBDA_ARN: '${self:custom.getSignedDownloadUrlArn}',
  },
};
