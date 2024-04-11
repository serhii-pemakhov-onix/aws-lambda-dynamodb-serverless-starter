/* eslint-disable no-template-curly-in-string */
import { handlerPath } from '@libs/handler-resolver';

export const dispatchFileUploadedEvent = {
  handler: `${handlerPath(__dirname)}/handler.dispatchFileUploadedEvent`,
  environment: {
    EVENT_BUS_NAME: '${self:custom.eventBusName}',
    FILE_TABLE_NAME: '${self:custom.filesTableName}',
  },
  events: [
    {
      s3: {
        bucket: '${self:custom.bucketName}',
        event: 's3:ObjectCreated:*',
        existing: true,
      },
    },
  ],
};
