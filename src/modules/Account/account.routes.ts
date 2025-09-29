import { AccountFactory } from "@modules/Account/account.factory";
import { Router } from "express";
import { validateToken } from "@middlewares/jwt";
import { bodyParser } from "@middlewares/bodyparser";
import { CreateAccountSchema } from "@lib/schema";

export const AccountRouter = Router();
    

AccountRouter.post(
    "/create",
    bodyParser(CreateAccountSchema),
    validateToken,
    AccountFactory.createController().createAccount
);
