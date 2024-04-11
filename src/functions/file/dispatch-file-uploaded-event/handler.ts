import { EventBridgeClientSingleton } from '@libs/aws-clients/event-bridge-client.singleton';
import { S3ClientSingleton } from '@libs/aws-clients/s3-client.singleton';
import { S3Event, S3EventRecord } from 'aws-lambda';
import { makeTokenizer } from '@tokenizer/s3';
import { fileTypeFromTokenizer } from 'file-type';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { PutEventsCommand } from '@aws-sdk/client-eventbridge';
import { S4_EVENTS } from '@constants/eventbridge.constants';

const S3Client = S3ClientSingleton.getClient();
const eventBridge = EventBridgeClientSingleton.getClient();

const urlDecode = (url: string) => decodeURIComponent(url.replace(/\+/g, ' '));

const dispatchFileUploadedEvent = async (event: S3Event) => {
  const eventPayloads = await Promise.all(
    event.Records.map(async (eventRecord: S3EventRecord) => {
      const bucketName = eventRecord.s3.bucket.name;
      const objectKey = urlDecode(eventRecord.s3.object.key);
      const [filePrefix, fileName] = objectKey.split('/');
      const fileSize = eventRecord.s3.object.size;

      const s3Tokenizer = await makeTokenizer(S3Client, {
        Bucket: bucketName,
        Key: objectKey,
      });

      const { ext } = await fileTypeFromTokenizer(s3Tokenizer);

      if (ext !== fileName.split('.').slice(-1)[0]) {
        const deleteParams = {
          Bucket: bucketName,
          Key: objectKey,
        };

        try {
          await S3Client.send(new DeleteObjectCommand(deleteParams));

          console.log(`Found inconsistent uploaded file type, deleting ${objectKey}`);
        } catch (error) {
          console.error('Error deleting found inconsistent object:', error);
        }

        return null;
      }

      return {
        Source: S4_EVENTS.SOURCE,
        DetailType: S4_EVENTS.DETAIL_TYPES.FILE_UPLOADED,
        Detail: JSON.stringify({
          bucketName,
          fileName,
          fileSize,
          filePrefix,
          fileType: ext,
        }),
        EventBusName: process.env.EVENT_BUS_NAME,
      };
    }),
  );

  const entries = eventPayloads.filter((x) => x);

  if (entries.length) {
    const params = { Entries: entries };

    try {
      await eventBridge.send(new PutEventsCommand(params));
    } catch (err) {
      console.error(err, err.stack);
    }
  }
};

module.exports = {
  dispatchFileUploadedEvent,
};
