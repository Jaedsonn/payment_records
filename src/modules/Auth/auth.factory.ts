import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { User } from "@modules/User/entity/user.entity";
import EmailService from "@shared/email.service";
import { AppDataSource } from "@shared/db/data-source"


export class AuthFactory
{
  public static createAuthController(): AuthController {
    return new AuthController(
      new AuthService( AppDataSource.getRepository(User), new EmailService()
        )
      );
  }
}
