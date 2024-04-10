import { handlerPath } from '@libs/handler-resolver';
import { GET, POST } from '@constants/http-method.constants';
import EventOptionsFactory from '@libs/event-options-factory';
import { Route } from '@common-types/route.type';

const BASE_PATH = 'shops';
const SWAGGER_TAG = 'Shops';

const renderOptions = EventOptionsFactory.http({ path: BASE_PATH, swaggerTags: [SWAGGER_TAG] });

export const create: Route = {
  /**
   * @function: api/src/functions/shop/handler.create
   */
  handler: `${handlerPath(__dirname)}/handler.create`,
  events: [
    {
      http: renderOptions({
        method: POST,
        bodyType: 'ShopCreateInput',
      }),
    },
  ],
};

export const getById: Route = {
  /**
  * @function: api/src/functions/shop/handler.getById
  */
  handler: `${handlerPath(__dirname)}/handler.getById`,
  events: [
    {
      http: renderOptions({
        method: GET,
        path: '{shopId}',
      }),
    },
  ],

};
