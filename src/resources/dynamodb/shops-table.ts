import { AWS } from '@serverless/typescript';

export const ShopsTable: AWS['resources']['Resources']['value'] = {
  Type: 'AWS::DynamoDB::Table',
  Properties: {
    TableName: 'ShopsTable',
    AttributeDefinitions: [
      {
        AttributeName: 'shopId',
        AttributeType: 'S',
      },
      {
        AttributeName: 'name',
        AttributeType: 'S',
      },
    ],
    KeySchema: [
      {
        AttributeName: 'shopId',
        KeyType: 'HASH',
      },
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'name-index',
        KeySchema: [
          {
            AttributeName: 'name',
            KeyType: 'HASH',
          },
          {
            AttributeName: 'shopId',
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
