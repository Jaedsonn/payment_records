import { Router } from "express";
import { AuthFactory } from "./auth.factory";

const AuthRouter = Router();

AuthRouter.post('/register',  AuthFactory.createAuthController().register);
AuthRouter.post('/login', AuthFactory.createAuthController().login)

export default AuthRouter;
