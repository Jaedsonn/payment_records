import { Router } from "express";
import { BankFactory } from "./bank.factory";
import { bodyParser } from "@middlewares/bodyparser";
import { CreateBankSchema } from "@lib/schema";
import { validateToken } from "@middlewares/jwt";

const BankRouter = Router();

BankRouter.get("/info/:id", validateToken, BankFactory.createController().getBankInfoById);
BankRouter.get("/info/name", validateToken, BankFactory.createController().getBankInfoByName);
BankRouter.post(
  "/register",
  validateToken,
  bodyParser(CreateBankSchema),
  BankFactory.createController().registerBank
);
BankRouter.get("/all", validateToken, BankFactory.createController().getAllBanks)
BankRouter.put("/update/:id", validateToken, bodyParser(CreateBankSchema), BankFactory.createController().updateBankInfo)

export { BankRouter };
