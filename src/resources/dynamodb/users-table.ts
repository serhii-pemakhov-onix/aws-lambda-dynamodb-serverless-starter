import { AWS } from '@serverless/typescript';

export const UsersTable: AWS['resources']['Resources']['value'] = {
  Type: 'AWS::DynamoDB::Table',
  Properties: {
    TableName: 'UsersTable',
    AttributeDefinitions: [
      {
        AttributeName: 'userId',
        AttributeType: 'S',
      },
      {
        AttributeName: 'email',
        AttributeType: 'S',
      },
    ],
    KeySchema: [{
      AttributeName: 'userId',
      KeyType: 'HASH',
    }],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'email-index',
        KeySchema: [
          {
            AttributeName: 'email',
            KeyType: 'HASH',
          },
          {
            AttributeName: 'userId',
            KeyType: 'RANGE',
          },
        ],
        Projection: {
          ProjectionType: 'ALL',
        },
        ProvisionedThroughput: {
          ReadCapacityUnits: 1,
          WriteCapacityUnits: 1,
        },
      },
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1,
    },
  },
};
