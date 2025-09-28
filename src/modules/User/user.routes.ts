import { Router } from "express";
import { UserFactory } from "./user.factory";
import { validateToken } from "@middlewares/jwt";
import { bodyParser } from "@middlewares/bodyparser";
import { UpdateUserSchema } from "@lib/schema";

export const UserRouter = Router();

UserRouter.put(
  "/update",
   validateToken,
   bodyParser(UpdateUserSchema),
   UserFactory.createUserController().updateUser
  );

UserRouter.get(
  "/info",
   validateToken,
   UserFactory.createUserController().getUserInfo
  );