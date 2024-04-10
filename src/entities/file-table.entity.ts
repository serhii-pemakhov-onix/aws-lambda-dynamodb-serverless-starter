import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { Table } from 'dynamodb-toolbox';

import {
  PRIMARY_KEY, SORT_KEY, LSI, KeyType,
} from '@resources/dynamodb/files-table';

const DocumentClient = new DynamoDBClient({
  region: 'us-east-1',
  credentials: {
    accessKeyId: 'MockAccessKeyId',
    secretAccessKey: 'MockSecretAccessKey',
  },
});

const findKeyName = (
  keySchema: { AttributeName: string; KeyType: KeyType }[],
  keyType: KeyType,
) => keySchema.find(({ KeyType: CurrentKeyType }) => CurrentKeyType === keyType).AttributeName;

const INDEXES = Object.values(LSI).reduce(
  (accIndexes, { IndexName, KeySchema }) => ({
    ...accIndexes,
    [IndexName]: {
      partitionKey: findKeyName(KeySchema, KeyType.HASH),
      sortKey: findKeyName(KeySchema, KeyType.RANGE),
    },
  }),
  {},
);

export const FileTableEntity = new Table({
  name: process.env.FILE_TABLE_NAME,
  partitionKey: PRIMARY_KEY,
  sortKey: SORT_KEY,
  indexes: INDEXES,
  autoExecute: true,
  autoParse: true,
  DocumentClient,
});
