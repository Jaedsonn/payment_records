import { Router } from "express";
import { UserFactory } from "./user.factory";
import { validateToken } from "@middlewares/jwt";

export const UserRouter = Router();

UserRouter.put(
  "/update",
   validateToken,
   UserFactory.createUserController().updateUser
  );

UserRouter.get(
  "/info",
   validateToken,
   UserFactory.createUserController().getUserInfo
  );

UserRouter.get(
  "/most-used-banks",
  validateToken,
  UserFactory.createUserController().getMostUsedBanks
)
