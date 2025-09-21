import { Router } from "express";
import { BankFactory } from "./bank.factory";

const BankRouter = Router();

BankRouter.get("/bank/info/:id", BankFactory.createController().getBankInfoById);
BankRouter.get("/bank/info/name", BankFactory.createController().getBankInfoByName);

export { BankRouter };