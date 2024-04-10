import HttpMethodType from '@common-types/http-method.type';

type HttpOptionsType = {
  method: HttpMethodType,
  path?: string,
  bodyType?: string,
  queryStringParameters?: Record<string, unknown>,
  swaggerTags?: string[],
  authorizer?: {
    name: string,
    type: string,
    identitySource: string,
  },
}

export default HttpOptionsType;
