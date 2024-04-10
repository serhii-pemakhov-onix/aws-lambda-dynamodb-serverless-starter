import dynamoDBClient from '../model';
import UserService from './user-service';
import ShopService from './shop-service';
import FileService from './file-service';

const fileService = new FileService(dynamoDBClient());
const shopService = new ShopService(dynamoDBClient());
const userService = new UserService(dynamoDBClient());

export {
  fileService,
  shopService,
  userService,
};
