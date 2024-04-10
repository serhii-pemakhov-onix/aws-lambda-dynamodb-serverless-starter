import { middify } from '@libs/lambda';
import { fileService } from '@services/index';
import { formatJSONResponse } from '@libs/api-gateway';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

/**
 * @function: ./src/functions/file/handler.getAll
 * @description: Get all files
 * @returns: { files: UploadedFileType[] }
 * @example: curl -X GET http://localhost:3000/dev/files/
 */
const getAll = middify(async () => {
  const files = await fileService.getAll();

  return formatJSONResponse({
    files,
  });
});

const getSignedUploadUrl: APIGatewayProxyHandler = middify(
  {
    type: 'object',
    properties: {
      queryStringParameters: {
        type: 'object',
        properties: {
          fileType: { type: 'string' },
          fileName: { type: 'string' },
        },
        required: ['fileType', 'fileName'],
      },
    },
    required: ['queryStringParameters'],
  },
  async (event: APIGatewayProxyEvent) => {
    const files = await fileService.getSignedUploadUrl({
      ...event,
    });

    return formatJSONResponse({
      files,
    });
  },
);

module.exports = {
  getAll,
  getSignedUploadUrl,
};
