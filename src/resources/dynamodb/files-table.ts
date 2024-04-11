import { AWS } from '@serverless/typescript';

// eslint-disable-next-line no-shadow
export enum KeyType {
  HASH = 'HASH',
  RANGE = 'RANGE',
}
const { HASH, RANGE } = KeyType;

export const PRIMARY_KEY = 'pk';
export const SORT_KEY = 'sk';
export const LSI_KEYS = { LSI: 'lsi' };

export const LSI = {
  BY_LSI: {
    IndexName: 'byLsi',
    KeySchema: [
      { AttributeName: PRIMARY_KEY, KeyType: HASH },
      { AttributeName: LSI_KEYS.LSI, KeyType: RANGE },
    ],
    Projection: { ProjectionType: 'ALL' },
  },
};

export const FilesTable: AWS['resources']['Resources']['value'] = {
  Type: 'AWS::DynamoDB::Table',
  Properties: {
    TableName: 'FilesTable1',
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

// export const FilesTable: AWS['resources']['Resources']['value'] = {
//   Type: 'AWS::DynamoDB::Table',
//   Properties: {
//     TableName: 'FilesTable',
//     AttributeDefinitions: [
//       { AttributeName: PRIMARY_KEY, AttributeType: 'S' },
//       { AttributeName: SORT_KEY, AttributeType: 'S' },
//       { AttributeName: LSI_KEYS.LSI, AttributeType: 'S' },
//     ],
//     KeySchema: [
//       { AttributeName: PRIMARY_KEY, KeyType: HASH },
//       { AttributeName: SORT_KEY, KeyType: RANGE },
//     ],
//     BillingMode: 'PAY_PER_REQUEST',
//     LocalSecondaryIndexes: [LSI.BY_LSI],
//     TimeToLiveSpecification: {
//       AttributeName: '_ttl',
//       Enabled: true,
//     },
//     StreamSpecification: {
//       StreamViewType: 'NEW_AND_OLD_IMAGES',
//     },
//   },
// };

export const FilesTableName: AWS['resources']['Outputs'] = {
  Value: { Ref: 'FilesTable' },
  Export: { Name: 'FilesTable' },
};

export const FilesTableArn: AWS['resources']['Outputs'] = {
  Value: { 'Fn::GetAtt': ['FilesTable', 'Arn'] },
  Export: { Name: 'FilesTableArn' },
};
