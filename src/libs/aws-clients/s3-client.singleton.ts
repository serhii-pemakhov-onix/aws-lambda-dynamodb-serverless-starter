import { S3Client } from '@aws-sdk/client-s3';

export class S3ClientSingleton {
  private static client: S3Client | null = null;

  public static getClient() {
    if (!S3ClientSingleton.client) {
      S3ClientSingleton.client = new S3Client({
        region: process.env.MY_AWS_REGION,
        credentials: {
          accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
          secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
        },
      });
    }

    return S3ClientSingleton.client;
  }
}
