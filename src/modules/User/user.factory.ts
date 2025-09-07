import { UserRepository } from "./repository/user.repository";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";

export class UserFactory{
  static createUserController(): UserController{
    return new UserController(new UserService( new UserRepository() ));
  }
}
