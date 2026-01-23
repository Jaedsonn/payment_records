import { Router } from "express";
import { AuthFactory } from "./auth.factory";
import { bodyParser } from "@middlewares/bodyparser";
import { CreateUserSchema, ForgotPasswordSchema, LoginUserSchema, ResetPasswordSchema } from "@lib/schema";

const AuthRouter = Router();

/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserDto'
 *     responses:
 *       201:
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 user:
 *                   type: object
    *                   properties:
    *                      id:
    *                       type: string
    *                      email:
    *                       type: string 
    *                      name:
    *                        type: string
    *                      password:
    *                        type: string
    *                      Accounts:
    *                        type: array     
 *                 message:
 *                   type: string
 *       400:
 *         description: User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 message:
 *                   type: string
 */
AuthRouter.post('/register',bodyParser(CreateUserSchema),  AuthFactory.createAuthController().register);
AuthRouter.post('/login',bodyParser(LoginUserSchema),  AuthFactory.createAuthController().login);
AuthRouter.post('/refresh-token',  AuthFactory.createAuthController().refreshToken);
AuthRouter.post('/logout',  AuthFactory.createAuthController().logout);
AuthRouter.post('/forgot-password',bodyParser(ForgotPasswordSchema),  AuthFactory.createAuthController().forgotPassword);
AuthRouter.post('/reset-password',bodyParser(ResetPasswordSchema),  AuthFactory.createAuthController().resetPassword);

export default AuthRouter;
