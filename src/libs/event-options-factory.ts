import HttpOptionsType from '@common-types/http-options.type';
import * as path from 'node:path';

function renderHttpOptions<T extends HttpOptionsType>(
  commonOptions: Pick<HttpOptionsType, 'path' | 'swaggerTags'>,
) {
  return (options: T) => ({
    ...options,
    path: path.join(...[commonOptions.path, options.path].filter((x) => x)),
    swaggerTags: commonOptions.swaggerTags,
  });
}

const EventOptionsFactory = {
  http: renderHttpOptions,
};

export default EventOptionsFactory;
