import { AccountFactory } from "@modules/Account/account.factory";
import { Router } from "express";
import { validateToken } from "@middlewares/jwt";
import { bodyParser } from "@middlewares/bodyparser";
import { CreateAccountSchema, UpdateAccountSchema } from "@lib/schema";

export const AccountRouter = Router();
    

AccountRouter.post(
    "/create",
    bodyParser(CreateAccountSchema),
    validateToken,
    AccountFactory.createController().createAccount
);

AccountRouter.put(
    "/update",
    bodyParser(UpdateAccountSchema),
    validateToken,
    AccountFactory.createController().updateAccount
)

AccountRouter.delete(
    "/delete/:id",
    validateToken,
    AccountFactory.createController().deleteAccount
)

AccountRouter.get(
    "/list",
    validateToken,
    AccountFactory.createController().listAccounts
)

AccountRouter.get(
    "/details/:id",
    validateToken,
    AccountFactory.createController().getAccountById
)

AccountRouter.get(
    "/details/:accountNumber",
    validateToken,
    AccountFactory.createController().getAccountByAccountNumber
)