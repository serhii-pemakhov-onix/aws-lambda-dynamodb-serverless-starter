import { Entity } from 'dynamodb-toolbox';

import { FileTableEntity } from '@entities/file-table.entity';

export const FileEntity = new Entity({
  name: 'File',
  attributes: {
    pk: { partitionKey: true, hidden: true },
    filePrefix: { sortKey: true },
    fileName: 'string',
    fileSize: 'number',
    fileType: 'string',
    bucketName: 'string',
  },
  table: FileTableEntity,
});
