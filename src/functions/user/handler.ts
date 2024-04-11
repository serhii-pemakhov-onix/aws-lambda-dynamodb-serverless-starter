import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { v4 as uuidv4 } from 'uuid';
import { formatJSONResponse } from '@libs/api-gateway';
import { middify } from '@libs/lambda';
import { userService } from '@services/index';
import { UserCreateInput } from './types';

type APIGatewayProxyEventWithBody<TBody> = Omit<APIGatewayProxyEvent, 'body'> & { body: TBody };

/**
 * @function: ./src/functions/user/handler.getAll
 * @description: Get all users
 * @returns: { users: User[] }
 * @example: curl -X GET http://localhost:3000/dev/user/
 */
const getAll = middify(async () => {
  const users = await userService.getAll();

  return formatJSONResponse({
    users,
  });
});

/**
 * @function: ./src/functions/user/handler.create
 * @description: Create a user
 * @returns: { user: User }
 * @example: curl -X POST http://localhost:3000/dev/user -d '{"email": "test@test"}'
 */
const create = middify(
  {
    type: 'object',
    required: ['body'],
    properties: {
      body: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email' },
        },
      },
    },
  },
  async (event: APIGatewayProxyEventWithBody<UserCreateInput>): Promise<APIGatewayProxyResult> => {
    const user = await userService.create({
      email: event.body.email,
      userId: uuidv4(),
      isVerified: false,
    });

    return formatJSONResponse({
      user,
    });
  },
);

/**
 * @function: ./src/functions/user/handler.getById
 * @description: Get a user by id
 * @returns: { user: User }
 * @example: curl -X GET http://localhost:3000/dev/user/123
 */
const getById = middify(
  {
    type: 'object',
    required: ['pathParameters'],
    properties: {
      pathParameters: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string', format: 'uuid' },
        },
      },
    },
  },
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const user = await userService.getById(event.pathParameters.userId);

    return formatJSONResponse({
      user,
    });
  },
);

/**
 * @function: ./src/functions/user/handler.getByEmail
 * @description: Get a user by email
 * @returns: { user: User }
 * @example: curl -X GET http://localhost:3000/dev/user/email/test@test
 */
const getByEmail = middify(
  {
    type: 'object',
    required: ['pathParameters'],
    properties: {
      pathParameters: {
        type: 'object',
        required: ['email'],
        properties: {
          email: { type: 'string', format: 'email' },
        },
      },
    },
  },
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const user = await userService.getByEmail(event.pathParameters.email);

    return formatJSONResponse({
      user,
    });
  },
);

/**
 * @function: ./src/functions/user/handler.update
 * @description: Update a user
 * @returns: { user: User }
 * @example: curl -X PUT http://localhost:3000/dev/user -d '{"email": "test@test"}'
 */
const setVerified = middify(
  {
    type: 'object',
    required: ['body'],
    properties: {
      body: {
        type: 'object',
        required: ['isVerified'],
        properties: {
          isVerified: { type: 'boolean' },
        },
      },
      pathParameters: {
        type: 'object',
        required: ['userId'],
        properties: {
          userId: { type: 'string', format: 'uuid' },
        },
      },
    },
  },
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const user = await userService.setVerified({
      userId: event.pathParameters.userId,
      isVerified: true,
    });

    return formatJSONResponse({
      user,
    });
  },
);

module.exports = {
  getAll,
  create,
  getById,
  getByEmail,
  setVerified,
};
