import { middify } from '@libs/lambda';
import { fileService } from '@services/index';
import { formatJSONResponse } from '@libs/api-gateway';
import { APIGatewayProxyEvent, APIGatewayProxyHandler } from 'aws-lambda';

/**
 * @function: src/functions/file/handler.getAll
 * @description: Gets all files
 * @returns: { files: File[] }
 * @example: curl -X GET http://localhost:3000/dev/files/
 */
const getAll = middify(async () => {
  const files = await fileService.getAll();

  return formatJSONResponse({
    files,
  });
});

/**
 * @function: src/functions/file/handler.getSignedUploadUrl
 * @description: Gets a file upload presigned URL
 * @returns: {
 *   "url": "https://{bucket-name}.s3.{region}.amazon.com/",
 *   "fields": {
 *     "x-amz-storage-class": "INTELLIGENT_TIERING",
 *     "bucket": "{bucket-name}",
 *     "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
 *     "X-Amz-Credential": "{AWS_ACCESS_KEY_ID}/{current-date}/{region}/s3/aws4_request",
 *     "X-Amz-Date": "20240410T074048Z",
 *     "key": "182a3a48-362a-4605-a74b-b95a86b3a6bc_file.pdf",
 *     "Policy": "eyJ...XX0=",
 *     "X-Amz-Signature": "203...982"
 *   }
 * }
 * @example: curl -X POST http://localhost:3000/dev/files/signed-upload-url?fileType=application%2Fpdf&fileName=file.pdf
 */
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
