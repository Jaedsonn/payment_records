import { User } from "./entity/user.entity";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { AppDataSource } from "@shared/db/data-source";

export class UserFactory{
  static createUserController(): UserController{
    return new UserController(new UserService( AppDataSource.getRepository(User) ));
  }
}
