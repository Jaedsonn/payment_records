import { Router } from "express";
import { AuthFactory } from "./auth.factory";
import { bodyParser } from "@middlewares/bodyparser";
import { CreateUserSchema, ForgotPasswordSchema, LoginUserSchema, ResetPasswordSchema } from "@lib/schema";

const AuthRouter = Router();

AuthRouter.post('/register',bodyParser(CreateUserSchema),  AuthFactory.createAuthController().register);
AuthRouter.post('/login',bodyParser(LoginUserSchema),  AuthFactory.createAuthController().login);
AuthRouter.post('/refresh-token',  AuthFactory.createAuthController().refreshToken);
AuthRouter.post('/logout',  AuthFactory.createAuthController().logout);
AuthRouter.post('/forgot-password',bodyParser(ForgotPasswordSchema),  AuthFactory.createAuthController().forgotPassword);
AuthRouter.post('/reset-password',bodyParser(ResetPasswordSchema),  AuthFactory.createAuthController().resetPassword);

export default AuthRouter;
