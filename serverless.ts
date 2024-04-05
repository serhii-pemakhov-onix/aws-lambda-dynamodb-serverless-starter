import type { AWS } from '@serverless/typescript';
import scanFs from '@libs/fs-scanner';

// User
import {
  getAll as usersGetAll,
  create as usersCreate,
  getById as usersGetById,
  getByEmail as usersGetByEmail,
  setVerified as setVerifiedUser,
} from '@functions/user/routes';

// Shop
import {
  create as shopsCreate,
  getById as shopsGetById,
} from '@functions/shop/routes';

// Mail
import {
  sendMail,
} from '@functions/mail/routes';

const TYPE_FILE_PATTERN = './src/**/*.d.ts';

const getConfiguration = async (): Promise<AWS> => {
  const typeFileNames = await scanFs(TYPE_FILE_PATTERN);

  return {
    service: 'NodeTeam',
    frameworkVersion: '3',
    plugins: [
      'serverless-auto-swagger',
      'serverless-esbuild',
      'serverless-dynamodb',
      'serverless-offline',
    ],
    provider: {
      name: 'aws',
      runtime: 'nodejs18.x',
      apiGateway: {
        minimumCompressionSize: 1024,
        shouldStartNameWithService: true,
      },
      environment: {
        AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      },
    },
    functions: {
      usersGetAll,
      usersCreate,
      usersGetById,
      usersGetByEmail,
      setVerifiedUser,
      shopsCreate,
      shopsGetById,
      sendMail,
    },
    package: { individually: true },
    custom: {
      esbuild: {
        bundle: true,
        minify: false,
        sourcemap: true,
        exclude: [],
        target: 'node18',
        define: { 'require.resolve': undefined },
        platform: 'node',
        concurrency: 10,
      },
      autoswagger: {
        title: 'NodeTeam',
        basePath: '/dev',
        typefiles: typeFileNames,
        apiType: 'http',
      },
      'serverless-dynamodb': {
        start: {
          port: 8000,
          docker: false,
          migrate: true,
          inMemory: false,
          dbPath: '../.dynamodb',
        },
      },
    },
    resources: {
      Resources: {
        UsersTable: {
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
        },
        ShopsTable: {
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
        },
      },
    },
  };
};

module.exports = getConfiguration();
