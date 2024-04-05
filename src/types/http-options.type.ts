import HttpMethodType from '@common-types/http-method.type';

type HttpOptionsType = {
  method: HttpMethodType,
  path?: string,
  bodyType?: string,
  swaggerTags?: string[],
}

export default HttpOptionsType;
