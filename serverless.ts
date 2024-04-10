import type { AWS } from '@serverless/typescript';
import scanFs from '@libs/fs-scanner';
import { ref } from '@libs/ref-factory';

import { EventBridge } from '@resources/event-bridge/event-bridge';

// S3
import { Bucket } from '@resources/s3/s3';

// DynamoDB Tables
import { UsersTable } from '@resources/dynamodb/users-table';
import { ShopsTable } from '@resources/dynamodb/shops-table';
import { FilesTable, FilesTableName, FilesTableArn } from '@resources/dynamodb/files-table';

// Authorizer
import { getUploadUrlAuthorizer } from '@functions/authorizer/upload/config';
// import { getDownloadUrlAuthorizer } from '@functions/authorizer/download/config';

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
import { sendMail } from '@functions/mail/routes';

// File
import { getSignedUploadUrl, listFiles } from '@functions/file/crud/routes';

const TYPE_FILE_PATTERN = './src/**/*.d.ts';

const getConfiguration = async (): Promise<AWS> => {
  const typeFileNames = await scanFs(TYPE_FILE_PATTERN);

  return {
    service: 'NodeTeam',
    frameworkVersion: '3',
    plugins: [
      'serverless-dotenv-plugin',
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
      // getDownloadUrlAuthorizer,
      getUploadUrlAuthorizer,
      getSignedUploadUrl,
      usersGetAll,
      usersCreate,
      usersGetById,
      usersGetByEmail,
      setVerifiedUser,
      shopsCreate,
      shopsGetById,
      sendMail,
      listFiles,
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
        apiKeyHeaders: ['Authorization'],
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
      bucketName: ref({ Bucket }),
      filesTableName: ref({ FilesTable }),
      filesTableStreamArn: { 'Fn::GetAtt': ['FilesTable', 'StreamArn'] },
      filesTableArn: { 'Fn::GetAtt': ['FilesTable', 'Arn'] },
      eventBridgeArn: 'arn:aws:events:#{AWS::Region}:#{AWS::AccountId}:event-bus/NodeTeam',
      eventBusName: ref({ EventBridge }),
      getSignedDownloadUrlArn: {
        'Fn::GetAtt': ['GetSignedDownloadUrlLambdaFunction', 'Arn'],
      },
      getSignedUploadUrlArn: {
        'Fn::GetAtt': ['GetSignedUploadUrlLambdaFunction', 'Arn'],
      },
    },
    resources: {
      Resources: {
        Bucket,
        EventBridge,
        FilesTable,
        ShopsTable,
        UsersTable,
      },
      Outputs: {
        FilesTableName,
        FilesTableArn,
      },
    },
  };
};

module.exports = getConfiguration();
