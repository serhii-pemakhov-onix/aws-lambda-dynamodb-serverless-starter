import { TABLE_NAMES } from '@constants/dynamodb.constants';
import { AWS } from '@serverless/typescript';

export const FilesTable: AWS['resources']['Resources']['value'] = {
  Type: 'AWS::DynamoDB::Table',
  Properties: {
    TableName: TABLE_NAMES.FILES,
    AttributeDefinitions: [
      {
        AttributeName: 'fileId',
        AttributeType: 'S',
      },
    ],
    KeySchema: [{
      AttributeName: 'fileId',
      KeyType: 'HASH',
    }],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  },
};
