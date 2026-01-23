
import { Router } from "express";
import { AuthFactory } from "./auth.factory";
import { bodyParser } from "@middlewares/bodyparser";
import { CreateUserSchema, ForgotPasswordSchema, LoginUserSchema, ResetPasswordSchema } from "@lib/schema";
import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);


export const authRegistry = new OpenAPIRegistry();
const AuthRouter = Router();

AuthRouter.post('/register',bodyParser(CreateUserSchema),  AuthFactory.createAuthController().register);
authRegistry.registerPath({
	method: 'post',
	path: '/register',
	tags: ['Auth'],
	summary: 'Register a new user',
	request: {
		body: {
			content: {
				'application/json': {
					schema: CreateUserSchema
				}
			}
		}
	},
	responses: {
		201: {
			description: 'User registered successfully',
			content: {
				'application/json': {
					schema: z.object({
						success: z.boolean().openapi({example: true}),
						message: z.string().openapi({example: 'User registered successfully'}),
						data: z.object({ user: z.any() })
					})
				}
			}
		},
		400: {
			description: 'User already exists',
			summary: 'User already exists or validation error'
		}
	}
});

AuthRouter.post('/login',bodyParser(LoginUserSchema),  AuthFactory.createAuthController().login);
authRegistry.registerPath({
	method: 'post',
	path: '/login',
	tags: ['Auth'],
	summary: 'Login a user',
	request: {
		body: {
			content: {
				'application/json': {
					schema: LoginUserSchema
				}
			}
		}
	},
	responses: {
		200: {
			description: 'Login successful',
			content: {
				'application/json': {
					schema: z.object({
						success: z.boolean().openapi({example: true}),
						message: z.string().openapi({example: 'Login successful'}),
						data: z.object({ user: z.any() })
					})
				}
			}
		},
		401: {
			description: 'Invalid credentials',
			summary: 'Invalid credentials or validation error'
		}
	}
});

AuthRouter.post('/refresh-token',  AuthFactory.createAuthController().refreshToken);
authRegistry.registerPath({
	method: 'post',
	path: '/refresh-token',
	tags: ['Auth'],
	summary: 'Refresh access token',
	request: {
		headers: z.object({
			refresh_token: z.string().openapi({
				description: 'Refresh token',
				example: 'your_refresh_token_here'
			})
		})
	},
	responses: {
		200: {
			description: 'Token refreshed',
			content: {
				'application/json': {
					schema: z.object({
						message: z.string().openapi({example: 'Token refreshed'})
					})
				}
			}
		},
		401: {
			description: 'Unauthorized',
			summary: 'Invalid or expired refresh token'
		}
	}
});

AuthRouter.post('/logout',  AuthFactory.createAuthController().logout);
authRegistry.registerPath({
	method: 'post',
	path: '/logout',
	tags: ['Auth'],
	summary: 'Logout user',
	responses: {
		200: {
			description: 'Logged out successfully',
			content: {
				'application/json': {
					schema: z.object({
						message: z.string().openapi({example: 'Logged out successfully'})
					})
				}
			}
		},
		500: {
			description: 'Internal server error',
			summary: 'Unexpected error during logout'
		}
	}
});

AuthRouter.post('/forgot-password',bodyParser(ForgotPasswordSchema),  AuthFactory.createAuthController().forgotPassword);
authRegistry.registerPath({
	method: 'post',
	path: '/forgot-password',
	tags: ['Auth'],
	summary: 'Request password reset',
	request: {
		body: {
			content: {
				'application/json': {
					schema: ForgotPasswordSchema
				}
			}
		}
	},
	responses: {
		200: {
			description: 'Password reset email sent',
			content: {
				'application/json': {
					schema: z.any()
				}
			}
		},
		404: {
			description: 'User not found',
			summary: 'No user with provided email'
		}
	}
});

AuthRouter.post('/reset-password',bodyParser(ResetPasswordSchema),  AuthFactory.createAuthController().resetPassword);
authRegistry.registerPath({
	method: 'post',
	path: '/reset-password',
	tags: ['Auth'],
	summary: 'Reset user password',
	request: {
		body: {
			content: {
				'application/json': {
					schema: ResetPasswordSchema
				}
			}
		}
	},
	responses: {
		200: {
			description: 'Password reset successful',
			content: {
				'application/json': {
					schema: z.any()
				}
			}
		},
		404: {
			description: 'User or token not found',
			summary: 'Invalid token or user not found'
		},
		401: {
			description: 'Unauthorized',
			summary: 'Token expired or invalid'
		}
	}
});

export default AuthRouter;
