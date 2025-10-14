import { Router } from "express";
import { TransactionFactory } from "./transaction.factory";
import { validateToken } from "@middlewares/jwt";
import { bodyParser } from "@middlewares/bodyparser";
import { CreateTransactionSchema, UpdateTransactionSchema } from "@lib/schema";

export const TransactionRouter = Router();

TransactionRouter.post(
  "/create",
  validateToken,
  bodyParser(CreateTransactionSchema),
  TransactionFactory.createController().createTransaction
);

TransactionRouter.get(
  "/list",
  validateToken,
  TransactionFactory.createController().listTransactions
);

TransactionRouter.get(
  "/summary",
  validateToken,
  TransactionFactory.createController().getTransactionSummary
);

TransactionRouter.get(
  "/:id",
  validateToken,
  TransactionFactory.createController().getTransactionById
);

TransactionRouter.put(
  "/:id/update",
  validateToken,
  bodyParser(UpdateTransactionSchema),
  TransactionFactory.createController().updateTransaction
);

TransactionRouter.delete(
  "/:id",
  validateToken,
  TransactionFactory.createController().deleteTransaction
);
