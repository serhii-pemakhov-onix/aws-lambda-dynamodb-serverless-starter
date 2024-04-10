import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { createPresignedPost } from '@aws-sdk/s3-presigned-post';
import { v4 as uuidv4 } from 'uuid';
import * as createHttpError from 'http-errors';
import File from '@model/File';
import { getFileSizeLimit, kB } from '@libs/file-size';
import { S3ClientSingleton } from '@libs/s3-client-singleton';

const URL_EXPIRES_IN_MS = 300;

export default class FileService {
  private TableName: string = 'FilesTable';

  private s3Client = S3ClientSingleton.getClient();

  constructor(private docClient: DocumentClient) {}

  async getAll(): Promise<File[]> {
    const files = await this.docClient.scan({
      TableName: this.TableName,
    }).promise();

    return files.Items as File[];
  }

  async getById(fileId: string): Promise<File> {
    const file = await this.docClient.get({
      TableName: this.TableName,
      Key: {
        fileId,
      },
    }).promise();

    return file.Item as File;
  }

  async create(file: File): Promise<File> {
    await this.docClient.put({
      TableName: this.TableName,
      Item: {
        ...file,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    }).promise();

    return file;
  }

  async getSignedUploadUrl({ queryStringParameters }) {
    const { fileType, fileName } = queryStringParameters;
    const fileSizeLimit = getFileSizeLimit(fileType);

    if (fileSizeLimit === 0) {
      throw new createHttpError.BadRequest();
    }

    const filePrefix = uuidv4();

    const presignedPost: { url: string; fields: Record<string, string> } = await createPresignedPost(
      this.s3Client,
      {
        Bucket: process.env.BUCKET_NAME,
        Key: `${filePrefix}_${fileName}`,
        Fields: {
          'x-amz-storage-class': 'INTELLIGENT_TIERING',
        },
        Expires: URL_EXPIRES_IN_MS,
        Conditions: [
          ['starts-with', '$key', `${filePrefix}`],
          ['content-length-range', kB(1), fileSizeLimit],
          { 'Content-Type': fileType },
        ],
      },
    );

    return {
      statusCode: 200,
      body: presignedPost,
    };
  }
}
