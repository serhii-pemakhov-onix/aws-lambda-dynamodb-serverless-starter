import { handlerPath } from '@libs/handler-resolver';
import { GET, PATCH, POST } from '@constants/http-method.constants';
import EventOptionsFactory from '@libs/event-options-factory';

type Route = {
  handler: string;
  events: any[];
}

const BASE_PATH = 'users';
const SWAGGER_TAG = 'Users';

const renderOptions = EventOptionsFactory.http({ path: BASE_PATH, swaggerTags: [SWAGGER_TAG] });

export const getAll: Route = {
  /**
   * @function: api/src/functions/user/handler.getAll
   */
  handler: `${handlerPath(__dirname)}/handler.getAll`,
  events: [
    {
      http: renderOptions({
        method: GET,
      }),
    },
  ],
};

export const create: Route = {
  /**
   * @function: api/src/functions/user/handler.create
   */
  handler: `${handlerPath(__dirname)}/handler.create`,
  events: [
    {
      http: renderOptions({
        method: POST,
        bodyType: 'UserCreateInput',
      }),
    },
  ],
};

export const getById: Route = {
  /**
   * @function: api/src/functions/user/handler.getById
   */
  handler: `${handlerPath(__dirname)}/handler.getById`,
  events: [
    {
      http: renderOptions({
        method: GET,
        path: '{userId}',
      }),
    },
  ],
};

export const getByEmail: Route = {
  /**
   * @function: api/src/functions/user/handler.getByEmail
   */
  handler: `${handlerPath(__dirname)}/handler.getByEmail`,
  events: [
    {
      http: renderOptions({
        method: GET,
        path: 'email/{email}',
      }),
    },
  ],
};

export const setVerified: Route = {
  /**
  * @function: api/src/functions/user/handler.setVerified
  */
  handler: `${handlerPath(__dirname)}/handler.setVerified`,
  events: [
    {
      http: renderOptions({
        method: PATCH,
        path: '{userId}',
      }),
    },
  ],
};
