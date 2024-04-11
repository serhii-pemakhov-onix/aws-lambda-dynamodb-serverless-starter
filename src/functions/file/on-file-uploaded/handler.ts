import { EventBridgeEvent } from 'aws-lambda';
import File from '@model/File';
import { fileService } from '@services/index';
import { S4_EVENTS } from '@constants/eventbridge.constants';

if (S4_EVENTS.DETAIL_TYPES.FILE_UPLOADED !== 'FILE_UPLOADED') {
  throw new Error(`Check constant "${S4_EVENTS.DETAIL_TYPES.FILE_UPLOADED}"`);
}

const onFileUploaded = async (
  event: EventBridgeEvent<'FILE_UPLOADED', File>,
): Promise<void> => {
  const {
    filePrefix, fileName, fileSize, fileType, bucketName,
  } = event.detail;

  console.log(JSON.stringify({ fileName }, null, 4));

  await fileService.create({
    filePrefix,
    fileName,
    fileSize,
    fileType,
    bucketName,
  });
};

module.exports = {
  onFileUploaded,
};
