/* eslint-disable no-template-curly-in-string */
import { S4_EVENTS } from '@constants/eventbridge.constants';
import { handlerPath } from '@libs/handler-resolver';

export const onFileUploaded = {
  handler: `${handlerPath(__dirname)}/handler.onFileUploaded`,
  environment: {
    FILE_TABLE_NAME: '${self:custom.filesTableName}',
  },
  events: [
    {
      eventBridge: {
        eventBus: '${self:custom.eventBridgeArn}',
        pattern: {
          source: [S4_EVENTS.SOURCE],
          'detail-type': [S4_EVENTS.DETAIL_TYPES.FILE_UPLOADED],
        },
      },
    },
  ],
};
