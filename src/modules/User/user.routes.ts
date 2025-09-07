import { Router } from "express";
import { UserFactory } from "./user.factory";

export  const UserRouter = Router();


UserRouter.put("/", UserFactory.createUserController().updateUser);
