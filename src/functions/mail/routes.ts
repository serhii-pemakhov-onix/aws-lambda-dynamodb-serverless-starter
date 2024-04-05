import { POST } from '@constants/http-method.constants';
import EventOptionsFactory from '@libs/event-options-factory';
import { handlerPath } from '@libs/handler-resolver';

type Route = {
  handler: string;
  events: any[];
}

const BASE_PATH = 'mail';
const SWAGGER_TAG = 'Mail';

const renderOptions = EventOptionsFactory.http({ path: BASE_PATH, swaggerTags: [SWAGGER_TAG] });

export const sendMail: Route = {
  /**
   * @function: api/src/functions/mail/handler.getAll
   */
  handler: `${handlerPath(__dirname)}/handler.sendMail`,
  events: [
    {
      http: renderOptions({
        method: POST,
      }),
    },
  ],
};
