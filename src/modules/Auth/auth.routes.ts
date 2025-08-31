import { Router } from "express";
import { AuthFactory } from "./auth.factory";

const AuthRouter = Router();

AuthRouter.post('/register',  AuthFactory.createAuthController().register);

export default AuthRouter;
