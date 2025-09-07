import { Router } from "express";
import { UserFactory } from "./user.factory";
import { validateToken } from "@middlewares/jwt";

export  const UserRouter = Router();

UserRouter.put(
  "/",
   validateToken,
   UserFactory.createUserController().updateUser
  );
