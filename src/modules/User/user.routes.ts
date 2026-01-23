import { Router } from "express";
import { UserFactory } from "./user.factory";
import { validateToken } from "@middlewares/jwt";
import { bodyParser } from "@middlewares/bodyparser";
import { UpdateUserSchema } from "@lib/schema";
import { OpenAPIRegistry  } from '@asteasolutions/zod-to-openapi';
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const UserRouter = Router();
export const userRegistry = new OpenAPIRegistry();


UserRouter.put(
  "/update",
   validateToken,
   bodyParser(UpdateUserSchema),
   UserFactory.createUserController().updateUser
  );

  userRegistry.registerPath({
    method: "put",
    path: "/update",
    summary: "Update user information",
    tags: ["User"],
    request: {
      body: {
        content: {
          "application/json": {
            schema: UpdateUserSchema
          }
        }
      }
    },
    responses: {
      200: {
        description: "User updated successfully"
      },
      400: {
        description: "Bad Request",
        summary: "Return a validation error if the request body does not conform to the UpdateUserSchema"
      }
    }
  })


UserRouter.get(
  "/info",
   validateToken,
   UserFactory.createUserController().getUserInfo
  );

userRegistry.registerPath({
  method: "get",
  path: "/info",
  summary: "Get user information",
  tags: ["User"],
  responses: {
    200: {
      description: "User retrieved successfully",
      content: {
        "application/json": {
          schema: z.object({
            success: z.boolean().openapi({example: true}),
            message: z.string().openapi({example: "User retrieved successfully"}),
            data: UpdateUserSchema
          })
        }
      }
    },
    404: {
      description: "Not Found",
      summary: "Return an error if the user is not found"
    }
  }
})