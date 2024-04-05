import HTTP_METHODS from '@constants/http-method.constants';
import ObjectValues from '@common-types/object-values.type';

type HttpMethodType = ObjectValues<typeof HTTP_METHODS>;

export default HttpMethodType;
