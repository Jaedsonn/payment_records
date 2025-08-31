import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { AuthRepository } from "./repository/auth.repository";

export class AuthFactory
{
  public static createAuthController(): AuthController {
    return new AuthController(new AuthService(new AuthRepository()));
  }
}
