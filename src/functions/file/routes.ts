/* eslint-disable no-template-curly-in-string */
import { Route } from '@common-types/route.type';
import { GET } from '@constants/http-method.constants';
import EventOptionsFactory from '@libs/event-options-factory';
import { handlerPath } from '@libs/handler-resolver';

const BASE_PATH = 'files';
const SWAGGER_TAG = 'Files';

const renderOptions = EventOptionsFactory.http({ path: BASE_PATH, swaggerTags: [SWAGGER_TAG] });

export const listFiles: Route & { environment: any } = {
  /**
   * @function: src/functions/file/handler.getAll
   */
  handler: `${handlerPath(__dirname)}/handler.getAll`,
  environment: {
    FILE_TABLE_NAME: '${self:custom.filesTableName}',
  },
  events: [
    {
      http: renderOptions({
        method: 'GET',
      }),
    },
  ],
};

export const getSignedUploadUrl = {
  handler: `${handlerPath(__dirname)}/handler.getSignedUploadUrl`,
  environment: {
    BUCKET_NAME: '${self:custom.bucketName}',
    FILE_TABLE_NAME: '${self:custom.filesTableName}',
  },
  events: [
    {
      http: renderOptions({
        method: GET,
        path: 'signed-upload-url',
        authorizer: {
          name: 'getUploadUrlAuthorizer',
          type: 'request',
          identitySource: 'method.request.header.Authorization',
        },
        queryStringParameters: {
          fileType: {
            required: false,
            type: 'string',
            description: 'Type of the uploaded file',
          },
          fileName: {
            required: false,
            type: 'string',
            description: 'Uploaded file\'s name',
          },
        },
      }),
    },
  ],
};
